// Complete workflow library configuration
export const workflowCategories = [
  {
    title: "Product & Validation",
    workflows: [
      {
        type: "idea-refiner",
        title: "Idea Refiner & Business Canvas",
        description: "Clarify idea, problem/solution, target audience, and generate Lean Canvas",
        emoji: "💡",
        path: "/idea-refiner"
      },
      {
        type: "mvp-diagnostic",
        title: "MVP Diagnostic",
        description: "Test if product is launchable MVP or just code",
        emoji: "🔍",
        path: "/mvp-diagnostic"
      },
      {
        type: "persona-icp",
        title: "Persona & ICP Builder",
        description: "Define ideal customers and early adopters",
        emoji: "👥",
        path: "/persona-icp"
      },
      {
        type: "feedback-loop",
        title: "Feedback Loop Setup",
        description: "Build channels for structured user input",
        emoji: "🔄",
        path: "/feedback-loop"
      }
    ]
  },
  {
    title: "Market & Customer",
    workflows: [
      {
        type: "market-sizing",
        title: "TAM/SAM/SOM Analyzer",
        description: "Estimate market size and opportunity",
        emoji: "📊",
        path: "/market-sizing"
      },
      {
        type: "competitor-analysis",
        title: "Competitor Benchmark Map",
        description: "Identify differentiation vs competitors",
        emoji: "🎯",
        path: "/competitor-analysis"
      },
      {
        type: "traction-tracker",
        title: "Early Traction Tracker",
        description: "Measure signals of demand",
        emoji: "📈",
        path: "/traction-tracker"
      }
    ]
  },
  {
    title: "Monetization & Pricing",
    workflows: [
      {
        type: "pricing-strategy",
        title: "Pricing Strategy Advisor",
        description: "Recommend best-fit pricing model",
        emoji: "💰",
        path: "/pricing-strategy"
      },
      {
        type: "offer-packaging",
        title: "Offer Design & Packaging",
        description: "Create pricing tiers and packages",
        emoji: "📦",
        path: "/offer-packaging"
      },
      {
        type: "revenue-simulator",
        title: "Revenue Simulator",
        description: "Model revenue scenarios",
        emoji: "💵",
        path: "/revenue-simulator"
      }
    ]
  },
  {
    title: "Social Media & Growth",
    workflows: [
      {
        type: "social-strategy",
        title: "Social Media Strategy Builder",
        description: "Plan growth via right channels",
        emoji: "📱",
        path: "/social-strategy"
      },
      {
        type: "content-calendar",
        title: "Content Calendar Generator",
        description: "Create 30-day post plan",
        emoji: "📅",
        path: "/content-calendar"
      },
      {
        type: "launch-checklist",
        title: "Launch Checklist",
        description: "Manage launch campaigns",
        emoji: "🚀",
        path: "/launch-checklist"
      },
      {
        type: "community-playbook",
        title: "Community Playbook",
        description: "Build early community",
        emoji: "🤝",
        path: "/community-playbook"
      }
    ]
  },
  {
    title: "Go-to-Market & Distribution",
    workflows: [
      {
        type: "gtm-planner",
        title: "GTM Planner",
        description: "Plan 90-day GTM roadmap",
        emoji: "🎯",
        path: "/gtm-planner"
      },
      {
        type: "funnel-designer",
        title: "Funnel Designer",
        description: "Map customer journey funnel",
        emoji: "🔀",
        path: "/funnel-designer"
      },
      {
        type: "messaging",
        title: "Messaging Agent",
        description: "Create launch messaging",
        emoji: "✍️",
        path: "/messaging"
      }
    ]
  },
  {
    title: "Operations & Team",
    workflows: [
      {
        type: "legal-ops",
        title: "Legal Ops Agent",
        description: "Guide incorporation and founder docs",
        emoji: "⚖️",
        path: "/legal-ops"
      },
      {
        type: "hiring",
        title: "Hiring Agent",
        description: "Suggest first hires and roles",
        emoji: "👔",
        path: "/hiring"
      },
      {
        type: "productivity",
        title: "Productivity Agent",
        description: "Suggest productivity stack",
        emoji: "⚡",
        path: "/productivity"
      }
    ]
  },
  {
    title: "Regulation & Compliance",
    workflows: [
      {
        type: "privacy-security",
        title: "Privacy & Security Agent",
        description: "Generate compliance checklist",
        emoji: "🔒",
        path: "/privacy-security"
      },
      {
        type: "legal-docs",
        title: "Legal Docs Agent",
        description: "Draft key legal documents",
        emoji: "📄",
        path: "/legal-docs"
      },
      {
        type: "risk-ip",
        title: "Risk & IP Agent",
        description: "Highlight legal and IP risks",
        emoji: "🛡️",
        path: "/risk-ip"
      }
    ]
  },
  {
    title: "Financials & Runway",
    workflows: [
      {
        type: "runway",
        title: "Runway Agent",
        description: "Calculate financial runway",
        emoji: "⏱️",
        path: "/runway"
      },
      {
        type: "forecast",
        title: "Forecast Agent",
        description: "Build 12-month financial projection",
        emoji: "📉",
        path: "/forecast"
      },
      {
        type: "cap-table",
        title: "Cap Table Agent",
        description: "Manage equity and dilution",
        emoji: "💼",
        path: "/cap-table"
      }
    ]
  },
  {
    title: "Fundraising & Storytelling",
    workflows: [
      {
        type: "investor-one-pager",
        title: "Investor One-Pager",
        description: "Create startup summary document",
        emoji: "📑",
        path: "/investor-one-pager"
      },
      {
        type: "pitch-deck",
        title: "Pitch Deck Agent",
        description: "Build investor pitch deck",
        emoji: "🎤",
        path: "/pitch-deck"
      },
      {
        type: "milestone-roadmap",
        title: "Milestone Agent",
        description: "Align roadmap with funding needs",
        emoji: "🗺️",
        path: "/milestone-roadmap"
      }
    ]
  },
  {
    title: "Brand & Identity",
    workflows: [
      {
        type: "narrative",
        title: "Narrative Agent",
        description: "Build founder story",
        emoji: "📖",
        path: "/narrative"
      },
      {
        type: "naming",
        title: "Naming Agent",
        description: "Suggest startup names",
        emoji: "🏷️",
        path: "/naming"
      },
      {
        type: "visual-kit",
        title: "Visual Kit Agent",
        description: "Draft lightweight visual identity",
        emoji: "🎨",
        path: "/visual-kit"
      }
    ]
  },
  {
    title: "Analytics & Metrics",
    workflows: [
      {
        type: "metrics",
        title: "Metrics Agent",
        description: "Track key SaaS metrics",
        emoji: "📊",
        path: "/metrics"
      },
      {
        type: "retention",
        title: "Retention Agent",
        description: "Show user retention analysis",
        emoji: "🔁",
        path: "/retention"
      },
      {
        type: "funnel-analytics",
        title: "Funnel Agent",
        description: "Track acquisition to conversion",
        emoji: "📉",
        path: "/funnel-analytics"
      }
    ]
  }
];
