import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface DashboardRequest {
  tenant_id: string
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { tenant_id } = (await req.json()) as DashboardRequest

    if (!tenant_id) {
      return new Response(
        JSON.stringify({ error: "Missing tenant_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || ""

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch latest metrics
    const { data: metrics } = await supabase
      .from("metrics")
      .select("*")
      .eq("tenant_id", tenant_id)
      .order("date", { ascending: false })
      .limit(30)

    // Fetch keywords summary
    const { data: keywords } = await supabase
      .from("keywords")
      .select("*")
      .eq("tenant_id", tenant_id)
      .order("position", { ascending: true })
      .limit(20)

    // Fetch competitors
    const { data: competitors } = await supabase
      .from("competitors")
      .select("*")
      .eq("tenant_id", tenant_id)

    // Fetch recent alerts
    const { data: alerts } = await supabase
      .from("alerts")
      .select("*")
      .eq("tenant_id", tenant_id)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(5)

    return new Response(
      JSON.stringify({
        metrics,
        keywords,
        competitors,
        alerts,
        timestamp: new Date().toISOString(),
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
