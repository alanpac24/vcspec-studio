import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, app_name, user_id } = await req.json();

    const PIPEDREAM_CLIENT_ID = Deno.env.get("PIPEDREAM_CLIENT_ID");
    const PIPEDREAM_CLIENT_SECRET = Deno.env.get("PIPEDREAM_CLIENT_SECRET");

    if (!PIPEDREAM_CLIENT_ID || !PIPEDREAM_CLIENT_SECRET) {
      throw new Error("Pipedream OAuth credentials not configured");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.pipedream.com/connect/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: PIPEDREAM_CLIENT_ID,
        client_secret: PIPEDREAM_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      throw new Error("Failed to exchange authorization code");
    }

    const tokenData = await tokenResponse.json();
    
    // Get account info from Pipedream
    const accountResponse = await fetch("https://api.pipedream.com/connect/accounts/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const accountData = await accountResponse.json();

    return new Response(
      JSON.stringify({
        account_id: tokenData.account_id || accountData.id,
        account_name: accountData.name || `${app_name} Account`,
        metadata: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          app_name,
          user_id,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("OAuth exchange error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
