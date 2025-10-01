import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file_path, file_name } = await req.json();

    if (!file_path) {
      return new Response(
        JSON.stringify({ error: "file_path is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Analyzing document:", file_path);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("deal-documents")
      .download(file_path);

    if (downloadError) throw downloadError;

    // Convert to base64 for AI processing
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Step 1: Extract text/data from document using AI
    console.log("Step 1: Document parsing");
    const parseResult = await parseDocument(base64, file_name);

    // Step 2: Extract structured data
    console.log("Step 2: Data extraction");
    const extractedData = await extractDealData(parseResult.content);

    // Step 3: Market analysis
    console.log("Step 3: Market analysis");
    const marketAnalysis = await analyzeMarket(extractedData);

    // Step 4: Team evaluation
    console.log("Step 4: Team evaluation");
    const teamEvaluation = await evaluateTeam(extractedData);

    // Step 5: Financial scoring
    console.log("Step 5: Financial analysis");
    const financialScore = await analyzeFinancials(extractedData);

    // Step 6: Generate final report
    console.log("Step 6: Generating report");
    const report = await generateReport({
      extractedData,
      marketAnalysis,
      teamEvaluation,
      financialScore,
    });

    return new Response(
      JSON.stringify({
        success: true,
        report,
        raw_data: {
          extracted: extractedData,
          market: marketAnalysis,
          team: teamEvaluation,
          financial: financialScore,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error analyzing document:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function parseDocument(base64: string, fileName: string): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "You are a document parser. Extract all relevant text and data from investment documents including company info, financials, team details, and market information.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Parse this investment document (${fileName}) and extract all text content, tables, and key information.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64}`,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Document parsing failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "",
  };
}

async function extractDealData(content: string): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "Extract structured data from investment documents.",
        },
        {
          role: "user",
          content: `Extract the following from this document:\n\n${content}\n\nReturn ONLY a JSON object with: company_name, stage, funding_amount, industry, team_size, founders, traction_metrics, problem, solution, market_size`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extract_deal_data",
            description: "Extract structured investment data",
            parameters: {
              type: "object",
              properties: {
                company_name: { type: "string" },
                stage: { type: "string" },
                funding_amount: { type: "string" },
                industry: { type: "string" },
                team_size: { type: "number" },
                founders: { type: "array", items: { type: "string" } },
                traction_metrics: { type: "object" },
                problem: { type: "string" },
                solution: { type: "string" },
                market_size: { type: "string" },
              },
              required: ["company_name"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "extract_deal_data" } },
    }),
  });

  const data = await response.json();
  const toolCall = data.choices[0]?.message?.tool_calls?.[0];
  return toolCall ? JSON.parse(toolCall.function.arguments) : {};
}

async function analyzeMarket(extractedData: any): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: "Analyze market opportunity for investment deals. Score 0-10.",
        },
        {
          role: "user",
          content: `Analyze market for: ${JSON.stringify(extractedData)}. Return JSON with: market_score (0-10), market_size_assessment, competition_level, growth_potential, key_risks`,
        },
      ],
    }),
  });

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
  } catch {
    return { market_score: 5, assessment: content };
  }
}

async function evaluateTeam(extractedData: any): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: `Evaluate team for: ${JSON.stringify(extractedData)}. Return JSON with: team_score (0-10), founder_experience, domain_expertise, team_completeness, red_flags`,
        },
      ],
    }),
  });

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
  } catch {
    return { team_score: 5, assessment: content };
  }
}

async function analyzeFinancials(extractedData: any): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: `Analyze financials for: ${JSON.stringify(extractedData)}. Return JSON with: financial_score (0-10), revenue_growth, burn_rate, runway_months, unit_economics, valuation_assessment`,
        },
      ],
    }),
  });

  const data = await response.json();
  const content = data.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
  } catch {
    return { financial_score: 5, assessment: content };
  }
}

async function generateReport(analysisData: any): Promise<any> {
  const { extractedData, marketAnalysis, teamEvaluation, financialScore } = analysisData;

  const totalScore = (
    (marketAnalysis.market_score || 0) +
    (teamEvaluation.team_score || 0) +
    (financialScore.financial_score || 0)
  ) / 3;

  let recommendation = "PASS";
  if (totalScore >= 7.5) recommendation = "DEEP DIVE";
  else if (totalScore >= 5.5) recommendation = "CONSIDER";

  return {
    company_name: extractedData.company_name || "Unknown",
    overall_score: totalScore.toFixed(1),
    recommendation,
    summary: {
      market: marketAnalysis,
      team: teamEvaluation,
      financial: financialScore,
    },
    extracted_data: extractedData,
    generated_at: new Date().toISOString(),
  };
}
