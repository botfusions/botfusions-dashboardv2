import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface ChatRequest {
  tenant_id: string
  user_id: string
  question: string
}

interface ChatResponse {
  response: string
  tokens_used: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { tenant_id, user_id, question } = (await req.json()) as ChatRequest

    // Validate inputs
    if (!tenant_id || !user_id || !question) {
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
    const claudeApiKey = Deno.env.get("CLAUDE_API_KEY") || ""

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Store user message
    await supabase.from("chat_history").insert({
      tenant_id,
      user_id,
      message: question,
      message_type: "user",
    })

    // Call Claude API
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        system: "You are a helpful marketing assistant for a business intelligence platform. Provide clear, concise answers about marketing metrics, SEO strategies, and competitor analysis.",
      }),
    })

    const claudeData = await claudeResponse.json() as Record<string, unknown>

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${JSON.stringify(claudeData)}`)
    }

    const assistantMessage = (claudeData.content as Array<{type: string; text: string}>)[0]?.text || "Unable to generate response"
    const tokensUsed = (claudeData.usage as Record<string, number>)?.output_tokens || 0

    // Store assistant response
    await supabase.from("chat_history").insert({
      tenant_id,
      user_id,
      message: question,
      response: assistantMessage,
      message_type: "assistant",
    })

    return new Response(
      JSON.stringify({
        response: assistantMessage,
        tokens_used: tokensUsed,
      } as ChatResponse),
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
