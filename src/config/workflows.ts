import { WorkflowCategory } from '@/types/workflow';

// Simplified workflow library configuration
export const workflowCategories: WorkflowCategory[] = [
  {
    title: "Product",
    workflows: [
      {
        type: "idea-refiner",
        title: "Idea Refiner",
        description: "Clarify and validate your idea",
        emoji: "💡",
        path: "/idea-refiner"
      },
      {
        type: "mvp-diagnostic",
        title: "MVP Diagnostic",
        description: "Test product readiness",
        emoji: "🔍",
        path: "/mvp-diagnostic"
      },
      {
        type: "persona-icp",
        title: "Customer Personas",
        description: "Define ideal customers",
        emoji: "👥",
        path: "/persona-icp"
      },
      {
        type: "feedback-loop",
        title: "Feedback System",
        description: "Collect user input",
        emoji: "🔄",
        path: "/feedback-loop"
      },
      {
        type: "narrative",
        title: "Brand Story",
        description: "Build your narrative",
        emoji: "📖",
        path: "/narrative"
      },
      {
        type: "naming",
        title: "Name Generator",
        description: "Create brand names",
        emoji: "🏷️",
        path: "/naming"
      },
      {
        type: "visual-kit",
        title: "Visual Identity",
        description: "Design brand assets",
        emoji: "🎨",
        path: "/visual-kit"
      }
    ]
  },
  {
    title: "Market",
    workflows: [
      {
        type: "market-sizing",
        title: "Market Size",
        description: "TAM/SAM/SOM analysis",
        emoji: "📊",
        path: "/market-sizing"
      },
      {
        type: "competitor-analysis",
        title: "Competitor Map",
        description: "Analyze competition",
        emoji: "🎯",
        path: "/competitor-analysis"
      },
      {
        type: "traction-tracker",
        title: "Traction Metrics",
        description: "Track market demand",
        emoji: "📈",
        path: "/traction-tracker"
      },
      {
        type: "pricing-strategy",
        title: "Pricing Strategy",
        description: "Set pricing model",
        emoji: "💰",
        path: "/pricing-strategy"
      },
      {
        type: "offer-packaging",
        title: "Price Tiers",
        description: "Create packages",
        emoji: "📦",
        path: "/offer-packaging"
      },
      {
        type: "revenue-simulator",
        title: "Revenue Model",
        description: "Project revenue",
        emoji: "💵",
        path: "/revenue-simulator"
      }
    ]
  },
  {
    title: "Growth",
    workflows: [
      {
        type: "gtm-planner",
        title: "GTM Strategy",
        description: "90-day launch plan",
        emoji: "🎯",
        path: "/gtm-planner"
      },
      {
        type: "funnel-designer",
        title: "Sales Funnel",
        description: "Customer journey",
        emoji: "🔀",
        path: "/funnel-designer"
      },
      {
        type: "messaging",
        title: "Messaging",
        description: "Marketing copy",
        emoji: "✍️",
        path: "/messaging"
      },
      {
        type: "social-strategy",
        title: "Social Strategy",
        description: "Channel planning",
        emoji: "📱",
        path: "/social-strategy"
      },
      {
        type: "content-calendar",
        title: "Content Plan",
        description: "30-day calendar",
        emoji: "📅",
        path: "/content-calendar"
      },
      {
        type: "launch-checklist",
        title: "Launch Plan",
        description: "Launch checklist",
        emoji: "🚀",
        path: "/launch-checklist"
      },
      {
        type: "community-playbook",
        title: "Community",
        description: "Build engagement",
        emoji: "🤝",
        path: "/community-playbook"
      }
    ]
  },
  {
    title: "Finance",
    workflows: [
      {
        type: "runway",
        title: "Cash Runway",
        description: "Financial timeline",
        emoji: "⏱️",
        path: "/runway"
      },
      {
        type: "forecast",
        title: "Projections",
        description: "12-month forecast",
        emoji: "📉",
        path: "/forecast"
      },
      {
        type: "cap-table",
        title: "Cap Table",
        description: "Equity management",
        emoji: "💼",
        path: "/cap-table"
      },
      {
        type: "investor-one-pager",
        title: "One-Pager",
        description: "Executive summary",
        emoji: "📑",
        path: "/investor-one-pager"
      },
      {
        type: "pitch-deck",
        title: "Pitch Deck",
        description: "Investor presentation",
        emoji: "🎤",
        path: "/pitch-deck"
      },
      {
        type: "milestone-roadmap",
        title: "Milestones",
        description: "Funding roadmap",
        emoji: "🗺️",
        path: "/milestone-roadmap"
      }
    ]
  },
  {
    title: "Operations",
    workflows: [
      {
        type: "legal-ops",
        title: "Incorporation",
        description: "Company setup",
        emoji: "⚖️",
        path: "/legal-ops"
      },
      {
        type: "hiring",
        title: "Team Building",
        description: "Hiring strategy",
        emoji: "👔",
        path: "/hiring"
      },
      {
        type: "productivity",
        title: "Tech Stack",
        description: "Tool selection",
        emoji: "⚡",
        path: "/productivity"
      },
      {
        type: "privacy-security",
        title: "Compliance",
        description: "Privacy & security",
        emoji: "🔒",
        path: "/privacy-security"
      },
      {
        type: "legal-docs",
        title: "Legal Docs",
        description: "Key documents",
        emoji: "📄",
        path: "/legal-docs"
      },
      {
        type: "risk-ip",
        title: "Risk & IP",
        description: "Legal protection",
        emoji: "🛡️",
        path: "/risk-ip"
      }
    ]
  },
  {
    title: "Analytics",
    workflows: [
      {
        type: "metrics",
        title: "Key Metrics",
        description: "Track KPIs",
        emoji: "📊",
        path: "/metrics"
      },
      {
        type: "retention",
        title: "Retention",
        description: "User analysis",
        emoji: "🔁",
        path: "/retention"
      },
      {
        type: "funnel-analytics",
        title: "Conversion",
        description: "Funnel tracking",
        emoji: "📉",
        path: "/funnel-analytics"
      }
    ]
  }
];
