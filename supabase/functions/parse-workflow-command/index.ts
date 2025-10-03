import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WORKFLOW_TEMPLATES = {
  'idea-refiner': {
    name: 'Idea Refiner & Business Canvas',
    description: 'Clarify your idea, define your ICP, and auto-generate a Lean Canvas',
    agents: [
      {
        name: 'Diagnostic Q&A Agent',
        description: 'Analyzes business idea with clarifying questions about problem, audience, and timing',
        inputs: 'User business idea description',
        outputs: 'Problem statement, target audience hypothesis, unique insights, key assumptions, clarifying questions',
        integrations: [],
        step_order: 1,
        ai_prompt: `You are a business diagnostic expert helping a founder clarify their business idea.

Analyze the business idea provided and conduct a thorough diagnostic by:
1. Identifying the core problem being solved
2. Understanding the target audience
3. Evaluating why now is the right time
4. Researching existing alternatives in the market
5. Uncovering unique insights

**Search the web** for:
- Similar solutions and products in this space
- Market validation and demand signals
- Recent trends that make this timely
- Customer pain points in this domain

Return a comprehensive JSON response with:
{
  "problem_statement": "Clear 2-3 sentence description of the problem",
  "target_audience_hypothesis": "Who experiences this problem most acutely",
  "unique_insight": "What non-obvious insight makes this idea compelling",
  "key_assumptions": ["Critical assumption 1", "Critical assumption 2", "Critical assumption 3"],
  "clarifying_questions": ["Question 1 to validate assumption", "Question 2 to understand market", "Question 3 about competition"],
  "existing_alternatives": [
    {"name": "Alternative 1", "description": "How people solve this today", "limitations": "Why it's insufficient"},
    {"name": "Alternative 2", "description": "Another way", "limitations": "Its shortcomings"}
  ],
  "market_signals": ["Signal 1 showing demand", "Signal 2 indicating timing"]
}

Business Idea: {{user_input}}`
      },
      {
        name: 'Customer Segments & ICP Builder',
        description: 'Creates 2-3 detailed Ideal Customer Profiles with demographics, psychographics, and jobs-to-be-done',
        inputs: 'Diagnostic results from previous agent',
        outputs: 'ICP profiles with segments, demographics, behaviors, pain points, and acquisition channels',
        integrations: [],
        step_order: 2,
        ai_prompt: `You are a customer segmentation expert. Based on the business diagnostic from the previous agent, create detailed Ideal Customer Profiles (ICPs).

**Search the web** for:
- Demographic data about these customer segments
- Behavioral patterns and preferences
- Where these customers congregate online
- Typical buying behaviors and decision criteria

Create 2-3 distinct ICP profiles. For EACH profile, return:
{
  "icps": [
    {
      "segment_name": "Primary Segment Name",
      "demographics": {
        "age_range": "e.g., 25-40",
        "location": "Geographic focus",
        "role": "Job title or role",
        "income_level": "Income bracket",
        "company_size": "If B2B"
      },
      "psychographics": {
        "values": ["What they care about", "Their priorities"],
        "behaviors": ["How they work", "Decision patterns"],
        "motivations": ["What drives them", "Success metrics"],
        "tech_savviness": "low/medium/high"
      },
      "jobs_to_be_done": [
        "Functional job 1",
        "Emotional job 2",
        "Social job 3"
      ],
      "pain_points": [
        "Specific pain 1 (with severity: high/medium/low)",
        "Specific pain 2",
        "Specific pain 3"
      ],
      "price_sensitivity": "low/medium/high",
      "channels_they_use": ["Platform 1", "Platform 2", "Community 3"],
      "estimated_segment_size": "Market size estimate with reasoning",
      "early_adopter_signals": ["Indicator 1", "Indicator 2"]
    }
  ],
  "primary_icp": "Which segment to target first and why"
}

Previous Analysis: {{previous_output}}`
      },
      {
        name: 'Problem-Solution Fit Agent',
        description: 'Drafts problem-solution fit and creates compelling value proposition',
        inputs: 'Diagnostic and ICP data',
        outputs: 'Problem-solution fit statement, value proposition, positioning, and differentiation',
        integrations: [],
        step_order: 3,
        ai_prompt: `You are a product positioning expert. Create a compelling problem-solution fit and value proposition.

Based on the problem identified and the ICPs defined, craft:

1. **Problem-Solution Fit Statement**: Clear articulation of how the solution addresses the problem
2. **Value Proposition**: Customer-benefit focused messaging
3. **Positioning**: How this fits in the competitive landscape
4. **Differentiation**: What makes this uniquely valuable

Return JSON:
{
  "problem_solution_fit": {
    "problem_recap": "The problem in customer language",
    "solution_approach": "How the product solves it",
    "fit_strength": "high/medium (with reasoning)",
    "validation_needed": ["What to test", "How to validate"]
  },
  "value_proposition": {
    "headline": "10 words max - compelling customer benefit",
    "three_core_benefits": [
      "Benefit 1: specific, measurable outcome",
      "Benefit 2: emotional or time-saving benefit",
      "Benefit 3: unique advantage"
    ],
    "customer_transformation": "From [current state] to [desired state]"
  },
  "positioning_statement": "For [target customer] who [need/problem], this is a [product category] that [key benefit]. Unlike [alternatives], we [unique differentiator].",
  "competitive_differentiation": {
    "unique_angle": "What's genuinely different",
    "proof_points": ["Credibility indicator 1", "Proof 2"],
    "moat": "What makes this defensible"
  },
  "messaging_framework": {
    "primary_message": "Core message for all communications",
    "supporting_messages": ["Message pillar 1", "Message pillar 2", "Message pillar 3"]
  }
}

Context: {{previous_output}}`
      },
      {
        name: 'Risks & Assumptions Logger',
        description: 'Identifies and logs critical risks and assumptions that need validation',
        inputs: 'All previous analysis',
        outputs: 'Categorized risks, assumptions to validate, and validation methods',
        integrations: [],
        step_order: 4,
        ai_prompt: `You are a risk analysis expert. Identify all critical risks and assumptions that could make or break this business.

Analyze the business idea, target customers, and value proposition to identify:
1. **Critical Assumptions**: What must be true for this to work
2. **Market Risks**: Threats from competition, timing, or demand
3. **Execution Risks**: Challenges in building or delivering
4. **Financial Risks**: Revenue, cost, or funding concerns

Return comprehensive JSON:
{
  "critical_assumptions": [
    {
      "assumption": "Clear statement of what we're assuming",
      "category": "market/customer/product/financial",
      "risk_level": "high/medium/low",
      "impact_if_wrong": "What happens if this is false",
      "validation_method": "How to test this",
      "estimated_cost_to_validate": "Time and resources needed",
      "validation_priority": "1-10"
    }
  ],
  "market_risks": [
    {
      "risk": "Specific market risk",
      "likelihood": "high/medium/low",
      "impact": "high/medium/low",
      "mitigation": "How to reduce this risk",
      "early_warning_signs": ["Signal 1", "Signal 2"]
    }
  ],
  "execution_risks": [
    {
      "risk": "Execution challenge",
      "likelihood": "high/medium/low",
      "impact": "high/medium/low",
      "mitigation": "How to address",
      "contingency": "Plan B if this occurs"
    }
  ],
  "financial_risks": [
    {
      "risk": "Financial concern",
      "likelihood": "high/medium/low",
      "impact": "high/medium/low",
      "mitigation": "Risk reduction strategy"
    }
  ],
  "validation_roadmap": [
    {
      "week": 1,
      "validation_goals": ["Assumption to test"],
      "method": "How to test",
      "success_criteria": "What validates or invalidates"
    }
  ],
  "kill_criteria": ["Dealbreaker 1", "Dealbreaker 2"],
  "pivot_triggers": ["Signal that suggests pivoting"]
}

Business Context: {{previous_output}}`
      },
      {
        name: 'Lean Canvas Generator',
        description: 'Auto-generates complete Lean/Business Model Canvas with all 9 boxes',
        inputs: 'All previous agent outputs',
        outputs: 'Complete Lean Canvas document with problem, solution, UVP, advantage, segments, metrics, channels, costs, revenue',
        integrations: [],
        step_order: 5,
        ai_prompt: `You are a Lean Canvas expert. Generate a complete, actionable Lean Canvas based on all previous analysis.

The Lean Canvas has 9 boxes:
1. **Problem**: Top 3 customer problems
2. **Solution**: Top 3 features (not full product)
3. **Unique Value Proposition**: Single, clear, compelling message
4. **Unfair Advantage**: Something that can't be easily copied
5. **Customer Segments**: Target users (prioritized)
6. **Key Metrics**: Numbers that matter
7. **Channels**: Path to customers
8. **Cost Structure**: Fixed and variable costs
9. **Revenue Streams**: How you make money

Return comprehensive JSON:
{
  "lean_canvas": {
    "problem": {
      "top_problems": [
        "Problem 1: Specific pain point",
        "Problem 2: Another critical issue",
        "Problem 3: Third important problem"
      ],
      "existing_alternatives": ["How it's solved today"],
      "reasoning": "Why these are the top 3"
    },
    "solution": {
      "top_features": [
        "Feature 1: MVP capability",
        "Feature 2: Core functionality",
        "Feature 3: Key differentiator"
      ],
      "reasoning": "Why these features solve the problems"
    },
    "unique_value_proposition": {
      "uvp": "Single sentence that explains why you're different and worth buying",
      "high_level_concept": "X for Y analogy if applicable"
    },
    "unfair_advantage": {
      "advantage": "What can't be easily copied or bought",
      "why_defensible": "Explanation of the moat",
      "time_to_replicate": "How long for competitor to copy"
    },
    "customer_segments": {
      "segments": ["Segment 1", "Segment 2"],
      "early_adopters": "Specific subset to target first",
      "beachhead": "Initial market entry point"
    },
    "key_metrics": {
      "metrics": [
        "Metric 1: Measure of traction",
        "Metric 2: Health indicator",
        "Metric 3: Success measure"
      ],
      "north_star": "The ONE metric that matters most"
    },
    "channels": {
      "channels": [
        "Channel 1: Specific path to customer",
        "Channel 2: Secondary acquisition",
        "Channel 3: Growth channel"
      ],
      "free_channels": ["Low-cost options"],
      "paid_channels": ["Paid acquisition"]
    },
    "cost_structure": {
      "fixed_costs": [
        "Cost 1: Monthly recurring",
        "Cost 2: Team/infrastructure"
      ],
      "variable_costs": [
        "Cost per customer",
        "Cost per transaction"
      ],
      "estimated_monthly_burn": "$X,XXX"
    },
    "revenue_streams": {
      "model_type": "subscription/transaction/usage/freemium",
      "streams": [
        "Primary revenue source",
        "Secondary income"
      ],
      "pricing_hypothesis": "$X per [unit]",
      "ltv_cac_target": "3:1 or better"
    }
  },
  "canvas_summary": {
    "business_model_type": "B2B SaaS/Marketplace/etc",
    "model_strengths": ["Strength 1", "Strength 2"],
    "model_risks": ["Risk 1", "Risk 2"],
    "next_steps": [
      "Immediate action 1",
      "Validation step 2",
      "Build priority 3"
    ]
  },
  "one_pager_summary": "Concise 3-paragraph summary suitable for investors or partners"
}

All Previous Analysis: {{previous_output}}`
      }
    ]
  },
  'market-research': {
    name: 'Market Research & Insights',
    description: 'Size your market, analyze competitors, and plan customer research',
    agents: [
      {
        name: 'Market Scope Agent',
        description: 'Defines market size and segmentation',
        inputs: 'Business idea and target customers',
        outputs: 'TAM/SAM/SOM estimates with methodology',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Define the market for {{business_idea}}. Search the web extensively for market size reports, industry analysis, and growth trends. Return JSON with: market_category (string), TAM_estimate (string with $ amount and calculation method), SAM (string for serviceable addressable market), SOM_year1_target (realistic first-year target), market_trends (array of trend descriptions), growth_rate (percentage), geographic_focus (array of regions), sources (array of URLs and report names used).'
      },
      {
        name: 'Competitor Analysis Agent',
        description: 'Maps competitive landscape with feature comparison',
        inputs: 'Market definition and business idea',
        outputs: 'Competitor matrix with strengths, weaknesses, pricing',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Research direct and indirect competitors for {{business_idea}}. Search the web for competitor websites, reviews, pricing pages, and user feedback. Return JSON with: competitors (array, each with: name, website, segment (direct/indirect), features array, pricing_model, price_range, strengths array, weaknesses array, positioning_statement, user_review_summary), whitespace_opportunities (array of underserved needs), competitive_moats_needed (array of defensibility strategies), market_leaders (top 3 by market share).'
      },
      {
        name: 'Voice of Customer Agent',
        description: 'Creates customer research methodology',
        inputs: 'ICP profiles and market analysis',
        outputs: 'Research plan with questions and community targets',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Create a customer research plan. Search the web for relevant online communities, forums, and social media groups where target customers gather. Return JSON with: interview_questions (array of 10 open-ended discovery questions), survey_outline (object with sections array, each having questions), communities_to_research (array with platform, community_name, url, why_relevant), key_insights_to_validate (array), research_timeline_weeks (number with justification), recruitment_strategy (string describing how to find interview subjects).'
      }
    ]
  },
  'offer-design': {
    name: 'Offer Design & Packaging',
    description: 'Define your MVP features and create compelling product tiers',
    agents: [
      {
        name: 'Feature Prioritization Agent',
        description: 'Defines MVP scope using MoSCoW method',
        inputs: 'ICP data and competitor features',
        outputs: 'Prioritized feature list with build complexity',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Based on ICP needs and competitor analysis, define the MVP feature set using MoSCoW prioritization. Return JSON with: must_have_features (array, each with feature_name, justification, estimated_effort_weeks), should_have_features (array with same structure), could_have_features (array), wont_have_v1 (array with feature and reasoning), feature_priority_matrix (object with quadrants: high_value_low_effort, high_value_high_effort, low_value_low_effort, low_value_high_effort), mvp_build_estimate_weeks (number), technical_complexity_risks (array).'
      },
      {
        name: 'Offer Packaging Agent',
        description: 'Designs 2-3 product tiers with clear differentiation',
        inputs: 'Feature prioritization results',
        outputs: 'Tiered pricing structure with positioning',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Design 2-3 offer tiers based on feature set. Search the web for SaaS packaging best practices and tiering strategies. Return JSON with: tiers (array of 2-3, each with: tier_name, tagline, features_included array, features_excluded array, ideal_customer_type, positioning, recommended_price_range), upsell_path (description of upgrade journey), downsell_strategy (if needed), packaging_rationale (string explaining tier logic), comparison_matrix (object showing feature availability across tiers).'
      },
      {
        name: 'Risk Reversal Agent',
        description: 'Designs guarantees and trial structures to reduce buyer risk',
        inputs: 'Offer tiers and target customer objections',
        outputs: 'Trust-building mechanisms and trial design',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Design trust-building and risk-reversal mechanisms. Return JSON with: guarantees (array, each with type (money-back/results-based/satisfaction), terms, duration, conditions), trial_structure (object with duration_days, limitations array, full_feature_or_limited, conversion_triggers array, trial_to_paid_tactics), objection_handlers (array with objection string and response string), pilot_program_design (object with pilot_criteria, success_metrics, pilot_duration, pricing_for_pilots), onboarding_flow (array of steps to reduce abandonment).'
      }
    ]
  },
  'pricing-strategy': {
    name: 'Pricing Strategy Advisor',
    description: 'Choose your pricing model and calculate optimal price points',
    agents: [
      {
        name: 'Pricing Model Selector',
        description: 'Recommends best pricing approach with rationale',
        inputs: 'Costs, ICP data, competitor pricing',
        outputs: 'Pricing model recommendation with examples',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Recommend a pricing model for the offer. Analyze: cost-plus (if cost_data provided), value-based (using willingness_to_pay indicators), competitor-anchored pricing, usage-based, tiered subscription. Search the web for pricing benchmarks in {{industry}} and {{business_model}}. Return JSON with: recommended_model (string), rationale (string), risks (array), alternative_models (array with model_name and when_to_consider), example_calculations (object showing math), pricing_psychology_tips (array), when_to_revisit (array of trigger events).'
      },
      {
        name: 'Price Point Calculator',
        description: 'Calculates specific prices across multiple scenarios',
        inputs: 'Pricing model and market data',
        outputs: 'Price recommendations with sensitivity analysis',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Calculate price points across 3 scenarios: conservative, moderate, aggressive. For each scenario return JSON with: scenarios (array with scenario_name, price_per_tier object, volume_assumption, monthly_revenue_projection, annual_revenue_projection, margin_percent, customer_acquisition_cost_assumption, ltv_cac_ratio, reasoning), recommended_starting_price (object with tier_prices and justification), price_testing_plan (object with test_variants, duration_weeks, success_metrics), discount_policy (object with allowed_discounts, discount_triggers, maximum_discount_percent), price_increase_roadmap (when and how to raise prices).'
      },
      {
        name: 'Pricing Communication Agent',
        description: 'Writes value-focused pricing page copy',
        inputs: 'Price points and value proposition',
        outputs: 'Pricing messaging and objection handlers',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Create pricing messaging that emphasizes value over cost. Return JSON with: pricing_page_copy (object with headline, subheadline, tier_descriptions object with tier_name keys, value_callouts array), value_justification_points (array of reasons price is fair), comparison_to_alternatives (string showing cost of NOT buying or alternative solutions), faq_answers (array with question and answer), sales_objection_responses (object with objection keys like "too_expensive", "need_to_think", "comparing_options" and response values), urgency_elements (array of ethical urgency tactics).'
      }
    ]
  },
  'gtm-planner': {
    name: 'Distribution & GTM Planner',
    description: 'Select channels, design your funnel, and build a 90-day launch plan',
    agents: [
      {
        name: 'Channel Strategy Agent',
        description: 'Recommends 2-3 primary distribution channels',
        inputs: 'ICP data and business model',
        outputs: 'Channel recommendations with tactics',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Based on ICP data, recommend 2-3 primary distribution channels. Analyze: content marketing, strategic partnerships, online marketplaces, paid advertising, outbound sales, community building, events/webinars, referral programs. Search the web for case studies of similar businesses. Return JSON with: recommended_channels (array with channel_name, why_fit_for_icp, effort_required (low/medium/high), time_to_results_months, estimated_cac, example_tactics array, success_metrics array), avoid_channels (array with channel and reasoning), primary_channel (single best channel to start), channel_sequencing (order to layer in additional channels).'
      },
      {
        name: 'Funnel Designer Agent',
        description: 'Designs customer acquisition funnel with KPIs',
        inputs: 'Channel strategy and offer details',
        outputs: 'Funnel stages with conversion targets',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Design a customer acquisition funnel with realistic benchmarks. Return JSON with: funnel_stages (array with stage_name (awareness/consideration/decision/activation/retention), goal, tactics array, kpis array, conversion_rate_target (percentage), average_time_in_stage), lead_magnet_ideas (array with idea, format, target_stage), activation_triggers (array of actions that indicate product adoption), retention_tactics (array), churn_prevention_strategies (array), funnel_math (object showing visitors -> leads -> customers calculation), critical_conversion_points (array of key moments that need optimization).'
      },
      {
        name: '90-Day Launch Planner',
        description: 'Creates detailed week-by-week execution roadmap',
        inputs: 'Channel strategy and funnel design',
        outputs: '90-day plan with tasks and milestones',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Create a detailed 90-day GTM execution plan broken into 2-week sprints. Return JSON with: pre_launch_phase (weeks -2 to 0, array of tasks), weeks (array of 12 weeks, each with week_number, sprint_name, focus_area, key_tasks array, deliverables array, success_metrics, risks_to_watch), launch_week_checklist (array of critical tasks), post_launch_optimization_plan (weeks 5-12 focus), assets_needed (array with asset_type, priority, deadline_week), team_roles_required (array with role, hours_per_week, can_be_founder_or_hire), budget_allocation_by_week (object).'
      }
    ]
  },
  'messaging-copy': {
    name: 'Messaging & Copy Generator',
    description: 'Create on-brand copy for landing pages, emails, and social media',
    agents: [
      {
        name: 'Brand Voice Tuner',
        description: 'Defines brand voice and tone guidelines',
        inputs: 'ICP psychographics and positioning',
        outputs: 'Voice attributes with sample copy',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Based on ICP psychographics and positioning, define a distinct brand voice. Return JSON with: voice_attributes (array of 3-5 adjectives like friendly, authoritative, playful, professional), tone_guidelines (object with do array and dont array), sample_phrases (array of 10 example phrases in brand voice), avoid_words (array of words/phrases that dont fit), voice_examples (object with casual_version, professional_version, and playful_version of the same message), personality_description (paragraph describing the brand as if it were a person).'
      },
      {
        name: 'Landing Page Copywriter',
        description: 'Writes complete landing page copy sections',
        inputs: 'Value proposition and brand voice',
        outputs: 'Landing page copy with hero, benefits, CTA',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Write landing page copy sections using the value proposition and brand voice. Return JSON with: hero (object with headline, subheadline, cta_text, cta_secondary_text), problem_agitation (paragraph painting the pain), solution_reveal (paragraph introducing the solution), how_it_works (array of 3 simple steps with title and description), features_benefits (array with feature_name, benefit_statement, icon_suggestion), social_proof_section (object with testimonial_template, trust_signals array, stats_to_highlight), objection_handling (array addressing common concerns), final_cta (object with headline, subheadline, button_text, urgency_element), meta_description (160 chars for SEO).'
      },
      {
        name: 'Email Sequence Writer',
        description: 'Drafts 5-email welcome/nurture sequence',
        inputs: 'Brand voice and offer details',
        outputs: 'Complete email sequence with subject lines',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Draft a 5-email welcome sequence matching brand voice. Return JSON with: emails (array of 5, each with email_number, subject_line, preview_text, email_body_markdown, cta_text, cta_url_placeholder, send_trigger (immediate/1day/3days/etc), goal, personalization_tokens array). Email sequence: 1) Welcome + deliver value immediately, 2) Education + build credibility, 3) Social proof + customer story, 4) Offer introduction + benefits, 5) Urgency + final CTA. Include guidance on segmentation and A/B test ideas.'
      },
      {
        name: 'Social Content Generator',
        description: 'Creates 10 ready-to-post social media posts',
        inputs: 'Brand voice and content themes',
        outputs: 'Social posts for LinkedIn, X, and Instagram',
        integrations: [],
        step_order: 4,
        ai_prompt: 'Create 10 social media posts across platforms. Return JSON with: posts (array of 10, each with platform (LinkedIn/X/Instagram/Threads), post_text, hook_first_line, cta, content_type (story/insight/tip/announcement/customer_win), hashtags array, image_suggestion, posting_best_time, engagement_goal). Mix formats: customer success stories (2), actionable tips (3), behind-the-scenes (2), product announcements (1), thought leadership (2). Make them authentic and value-first, not salesy.'
      }
    ]
  },
  'financials': {
    name: 'Simple Financials & Milestones',
    description: 'Project revenue, plan expenses, and set key business milestones',
    agents: [
      {
        name: 'Expense Budget Builder',
        description: 'Creates 12-month lean expense budget',
        inputs: 'Business model and operational needs',
        outputs: 'Monthly expense budget with runway calculation',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Create a realistic 12-month lean expense budget for a {{business_type}} business. Search the web for typical early-stage startup costs in this category. Return JSON with: monthly_expenses (object with tools_software array (each with tool, cost), contractors array (role, monthly_cost), ads_marketing (estimated spend), infrastructure (hosting, domains, etc array), other array), total_monthly_burn (number), runway_months (if starting_capital provided), break_even_target (object with monthly_revenue_needed, customers_needed, months_to_breakeven_estimate), cost_optimization_tips (array), when_to_increase_spend (array of milestones that justify more investment).'
      },
      {
        name: 'Revenue Projections Agent',
        description: 'Models realistic 12-month revenue scenarios',
        inputs: 'Pricing and GTM assumptions',
        outputs: 'Revenue projections with best/worst cases',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Project revenue for 12 months based on pricing and GTM plan. Be conservative and realistic. Return JSON with: months (array of 12, each with month_number, new_customers, churned_customers, total_active_customers, mrr, arr, cumulative_revenue, growth_rate_percent), assumptions (object with conversion_rates, monthly_growth_rate, churn_rate, average_deal_size), best_case_scenario (object with different assumptions and outcomes), worst_case_scenario (object), most_likely_scenario (object), reality_check_notes (array of cautionary reminders), sensitivity_analysis (array showing impact of changing key variables).'
      },
      {
        name: 'Milestone Tracker',
        description: 'Defines key business milestones and success criteria',
        inputs: 'Revenue projections and business goals',
        outputs: 'Milestone roadmap with metrics',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Define key business milestones for the first 12-18 months. Return JSON with: milestones (array with milestone_name, target_month, success_criteria array, why_it_matters, risks array, dependencies array, celebration_idea), month_by_month_goals (object with monthly objectives), pivot_triggers (array of signals that suggest strategy change is needed), north_star_metric (the one metric that matters most), leading_indicators (array of early signals of success or failure), fundraising_milestones (if applicable), team_growth_milestones (when to hire), product_milestones (feature launches).'
      }
    ]
  },
  'risk-compliance': {
    name: 'Risk, Compliance & Ops Readiness',
    description: 'Legal templates, brand protection, and operational readiness',
    agents: [
      {
        name: 'Legal Basics Agent',
        description: 'Provides legal templates and compliance checklist',
        inputs: 'Business model and geography',
        outputs: 'Legal document outlines and when to hire lawyer',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Generate basic legal guidance for {{business_type}} in {{country}}. Search the web for legal requirements and regulations for this business type. Return JSON with: terms_of_service_outline (object with key_sections array, each with section_name and key_points), privacy_policy_outline (object with data_collected array, data_usage, retention_policy, user_rights, gdpr_ccpa_compliance_notes), refund_policy_template (string), disclaimer_text (string for website footer), legal_entity_recommendations (array with entity_type and pros_cons), when_to_hire_lawyer (array of situations requiring attorney), compliance_checklist (array), ip_protection_basics (trademark, copyright guidance).'
      },
      {
        name: 'Brand Protection Agent',
        description: 'Creates brand protection and domain strategy',
        inputs: 'Business name and branding',
        outputs: 'Domain checklist and trademark guidance',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Create a brand protection checklist. Search the web for domain registrars, trademark databases, and social media availability. Return JSON with: domain_registration_checklist (object with domains_to_buy array (.com, .io, .ai, etc), registrar_recommendations, privacy_protection_tips), trademark_search_process (array of steps and databases to check), social_handles_to_claim (array with platform and handle), competitor_name_conflicts_check (guidance on checking for conflicts), brand_assets_to_protect (array like logo, tagline, product names), domain_security_tips (array), backup_names (array of alternative brand names if primary is taken).'
      },
      {
        name: 'Ops Readiness Agent',
        description: 'Identifies operational dependencies and tools',
        inputs: 'Business model and scale plans',
        outputs: 'Tools stack and process documentation needs',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Identify operational requirements and tools needed. Return JSON with: tools_stack (array with category (email, payments, analytics, support, etc), tool_recommendations array (each with name, why_needed, cost_range, alternatives), integration_requirements), processes_to_document (array with process_name, why_important, template_outline), automation_opportunities (array with task, automation_tool, time_saved), team_roles_needed (array with role, responsibilities array, when_to_hire (month), full_time_or_contract, estimated_cost), scaling_bottlenecks (array of things that will break as you grow), quality_assurance_checklist (array), customer_support_setup (object with channels, tools, response_time_targets).'
      }
    ]
  },
  'investor-one-pager': {
    name: 'Investor/Partner One-Pager',
    description: 'Generate pitch materials and elevator pitches from your business data',
    agents: [
      {
        name: 'One-Pager Writer',
        description: 'Writes concise investor one-pager',
        inputs: 'Business canvas and market research',
        outputs: 'One-page pitch document',
        integrations: [],
        step_order: 1,
        ai_prompt: 'Write an investor or partner one-pager using business canvas and market data. Return JSON with: company_overview (2-3 sentences), problem_statement (paragraph), solution_description (paragraph), market_opportunity (object with tam_sam_som, growth_trends), business_model (string), traction_to_date (array of achievements, or "pre-launch" status), competitive_advantage (string), team_highlights (array if team exists, or founder background), ask (object with type (investment/partnership/pilots), amount_or_terms, use_of_funds array), contact_info_placeholder (object). Keep total word count under 400 words for true one-page formatting.'
      },
      {
        name: 'Pitch Deck Outliner',
        description: 'Creates 10-slide pitch deck outline',
        inputs: 'One-pager and all workflow outputs',
        outputs: 'Slide-by-slide deck structure',
        integrations: [],
        step_order: 2,
        ai_prompt: 'Create a 10-slide pitch deck outline pulling from all previous workflow data. Return JSON with: slides (array of 10, each with slide_number, title, key_points array, visual_suggestions (chart/image/screenshot ideas), presenter_notes). Standard flow: 1) Problem (customer pain), 2) Solution (your product), 3) Market Opportunity (TAM/SAM/SOM), 4) Product/Demo (how it works), 5) Traction (metrics or early validation), 6) Business Model (revenue model), 7) Competition (landscape and differentiation), 8) Go-to-Market (distribution strategy), 9) Team (founders and advisors), 10) Ask (investment amount and use). Tailor depth based on business stage.'
      },
      {
        name: 'Elevator Pitch Generator',
        description: 'Writes 30sec, 60sec, and 2min pitch versions',
        inputs: 'One-pager and value proposition',
        outputs: 'Multiple elevator pitch versions',
        integrations: [],
        step_order: 3,
        ai_prompt: 'Write 3 versions of an elevator pitch: 30-second, 60-second, and 2-minute. Return JSON with: pitches (object with thirty_second (string ~75 words), sixty_second (string ~150 words), two_minute (string ~300 words)), hook_opening_lines (array of 5 different attention-grabbing first sentences), closing_ctas (array of 3 different closing call-to-actions like asking for meeting, email, intro), pitch_framework_used (string like Problem-Solution-Traction or Hook-Story-Ask), conversation_starters (array of natural ways to bring up the business), objection_responses (object with common_objection keys and concise_response values). Make pitches conversational, memorable, and jargon-free.'
      }
    ]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command } = await req.json();
    
    if (!command) {
      return new Response(
        JSON.stringify({ error: 'Command is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get API keys
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const PIPEDREAM_PROJECT_ID = Deno.env.get('PIPEDREAM_PROJECT_ID');
    const PIPEDREAM_CLIENT_ID = Deno.env.get('PIPEDREAM_CLIENT_ID');
    const PIPEDREAM_CLIENT_SECRET = Deno.env.get('PIPEDREAM_CLIENT_SECRET');
    const PIPEDREAM_ENVIRONMENT = Deno.env.get('PIPEDREAM_ENVIRONMENT') || 'development';

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating bespoke workflow for command:', command);

    // Discover apps from command using Pipedream if credentials available
    let discoveredApps: string[] = [];
    if (PIPEDREAM_PROJECT_ID && PIPEDREAM_CLIENT_ID && PIPEDREAM_CLIENT_SECRET) {
      try {
        console.log('Discovering apps from command using Pipedream...');
        
        // Get Pipedream access token
        const tokenResponse = await fetch('https://api.pipedream.com/v1/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: PIPEDREAM_CLIENT_ID,
            client_secret: PIPEDREAM_CLIENT_SECRET,
          }),
        });

        if (tokenResponse.ok) {
          const { access_token } = await tokenResponse.json();

          // Extract potential app names from command
          const potentialApps = command.toLowerCase().match(/\b(gmail|slack|notion|sheets|crm|hubspot|salesforce|airtable|trello|asana|jira|discord|teams|calendar|drive|dropbox|github|twitter|linkedin|facebook|instagram|mailchimp|stripe|paypal|shopify|wordpress|zendesk|intercom|crunchbase|pipedrive|typeform)\b/g) || [];
          
          if (potentialApps.length > 0) {
            // Search for each potential app
            const appPromises = potentialApps.map(async (appName: string) => {
              try {
                const appsResponse = await fetch(`https://api.pipedream.com/v1/apps?q=${encodeURIComponent(appName)}&sort_key=featured_weight&sort_direction=desc&limit=1`, {
                  headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                if (appsResponse.ok) {
                  const appsData = await appsResponse.json();
                  return appsData.data?.[0]?.name_slug || null;
                }
              } catch (e) {
                console.error(`Error fetching app ${appName}:`, e);
              }
              return null;
            });

            const apps = await Promise.all(appPromises);
            discoveredApps = apps.filter(app => app !== null) as string[];
            console.log('Discovered apps:', discoveredApps);
          }
        }
      } catch (error) {
        console.error('Error discovering apps from Pipedream:', error);
        // Continue without app discovery
      }
    }

    // Call Lovable AI to generate workflow with discovered apps context
    const appsContext = discoveredApps.length > 0 
      ? `\n\nDetected integrations from command: ${discoveredApps.join(', ')}. Use these apps where appropriate in the workflow.`
      : '';

    const customWorkflowResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are a business automation expert helping first-time founders launch tech businesses. Given a user's request about starting or growing their business, design a multi-step workflow with 2-4 AI agents.${appsContext}

Context: Users are creative builders who want to turn ideas into real businesses but lack formal business training. They need structured, actionable workflows that produce tangible deliverables (docs, spreadsheets, plans).

For each agent, provide:
- name: Clear, action-oriented name (e.g., "ICP Builder Agent")
- description: What this agent does in plain language
- inputs: What data it receives (from user or previous agent)
- outputs: What deliverables it produces
- integrations: Array of tools if needed (e.g., ["google-docs", "sheets"])
- ai_prompt: Detailed instructions for AI that will execute this step. IMPORTANT: 
  * Include "Search the web for..." when real-time market data, competitor info, or best practices are needed
  * Ask for structured JSON outputs with specific fields
  * Reference business frameworks (Lean Canvas, Jobs-to-be-Done, MoSCoW prioritization)
  * Be beginner-friendly but not dumbed down
- step_order: 1, 2, 3, etc.

The workflow should help users:
1. Validate and structure their business idea
2. Understand their market and customers
3. Design compelling offers and pricing
4. Plan go-to-market and distribution
5. Create marketing assets and pitch materials
6. Prepare for execution (legal, ops, financials)

Focus on outputs that users can immediately use (pitch decks, landing page copy, pricing sheets, research reports).

Return ONLY valid JSON:
{
  "name": "Workflow Name",
  "workflow_type": "kebab-case-type",
  "description": "What this workflow accomplishes",
  "agents": [array of agents with all required fields]
}`
            },
            {
              role: 'user',
              content: `Create a workflow for: ${command}`
            }
          ]
        })
    });

    if (!customWorkflowResponse.ok) {
      console.error('Failed to generate custom workflow');
      return new Response(
        JSON.stringify({ error: 'Failed to generate workflow' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const customData = await customWorkflowResponse.json();
    const customContent = customData.choices[0].message.content;
    console.log('AI generated workflow:', customContent);

    let customWorkflow;
    try {
      // Try to extract JSON from markdown code blocks or raw JSON
      const jsonMatch = customContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                        customContent.match(/```\s*([\s\S]*?)\s*```/) ||
                        customContent.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : customContent.trim();
      customWorkflow = JSON.parse(jsonStr);
      
      // Validate and ensure agents have required fields
      if (!customWorkflow.agents || customWorkflow.agents.length === 0) {
        throw new Error('No agents generated');
      }

      // Ensure each agent has required fields
      customWorkflow.agents = customWorkflow.agents.map((agent: any, idx: number) => ({
        name: agent.name || `Agent ${idx + 1}`,
        description: agent.description || 'Automated agent',
        inputs: agent.inputs || 'Data from previous step',
        outputs: agent.outputs || 'Processed data',
        integrations: Array.isArray(agent.integrations) ? agent.integrations : [],
        ai_prompt: agent.ai_prompt || `Process the input data for step ${idx + 1}`,
        step_order: agent.step_order || idx + 1,
      }));

      console.log('Parsed custom workflow:', customWorkflow);

    } catch (e) {
      console.error('Failed to parse custom workflow:', e);
      console.error('Raw AI response:', customContent);
      
      // Fallback: Create a basic workflow
      customWorkflow = {
        name: 'Custom Workflow',
        description: command,
        agents: [
          {
            name: 'Data Processing Agent',
            description: 'Processes input data according to your requirements',
            inputs: 'Trigger data',
            outputs: 'Processed results',
            integrations: discoveredApps.length > 0 ? discoveredApps : [],
            ai_prompt: `Based on this request: "${command}", analyze and process the input data appropriately. Search the web if you need current information. Return structured JSON output.`,
            step_order: 1,
          }
        ]
      };
    }

    // Enhance workflow with discovered apps if not already included
    if (discoveredApps.length > 0 && customWorkflow.agents) {
      customWorkflow.agents = customWorkflow.agents.map((agent: any) => {
        // Add discovered apps to agent integrations if they don't have any
        if (!agent.integrations || agent.integrations.length === 0) {
          return {
            ...agent,
            integrations: discoveredApps
          };
        }
        return agent;
      });
    }

    return new Response(
      JSON.stringify({
        workflow_type: 'custom',
        name: customWorkflow.name || 'Custom Workflow',
        description: customWorkflow.description || command,
        agents: customWorkflow.agents || [],
        discovered_apps: discoveredApps,
        confidence: 0.8
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in parse-workflow-command:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});