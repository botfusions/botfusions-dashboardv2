import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface NotificationRequest {
  tenant_id: string
  user_id: string
  type: "email" | "telegram" | "webhook"
  recipient: string
  subject?: string
  message: string
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { tenant_id, user_id, type, recipient, subject, message } =
      (await req.json()) as NotificationRequest

    if (!tenant_id || !user_id || !type || !recipient || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || ""

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Store notification in database
    const { data: notification, error: dbError } = await supabase
      .from("notifications")
      .insert({
        tenant_id,
        user_id,
        type,
        recipient,
        subject,
        message,
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    let sendStatus = "pending"

    try {
      // Send notification based on type
      if (type === "email") {
        // TODO: Implement email sending (e.g., SendGrid, Resend)
        console.log(`Email would be sent to ${recipient}: ${message}`)
        sendStatus = "sent"
      } else if (type === "telegram") {
        // TODO: Implement Telegram sending
        console.log(`Telegram message would be sent to ${recipient}: ${message}`)
        sendStatus = "sent"
      } else if (type === "webhook") {
        const response = await fetch(recipient, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, message }),
        })

        if (!response.ok) {
          throw new Error(`Webhook failed: ${response.statusText}`)
        }

        sendStatus = "sent"
      }

      // Update notification status
      await supabase
        .from("notifications")
        .update({ status: sendStatus, sent_at: new Date().toISOString() })
        .eq("id", notification.id)
    } catch (error) {
      console.error("Send error:", error)

      // Update notification status to failed
      await supabase
        .from("notifications")
        .update({ status: "failed" })
        .eq("id", notification.id)

      sendStatus = "failed"
    }

    return new Response(
      JSON.stringify({
        success: sendStatus === "sent",
        notification_id: notification.id,
        status: sendStatus,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
