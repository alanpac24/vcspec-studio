import { useState, KeyboardEvent } from "react";
import { WorkflowCard } from "./WorkflowCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkflowPreview } from "./WorkflowPreview";

const workflows = [
  {
    title: "Idea Refiner & Business Canvas",
    description: "Clarify your idea, define your ICP, and auto-generate a Lean Canvas",
    path: "/idea-refiner",
    emoji: "💡",
  },
  {
    title: "Market Research & Insights",
    description: "Size your market, analyze competitors, and plan customer research",
    path: "/market-research",
    emoji: "🔍",
  },
  {
    title: "Offer Design & Packaging",
    description: "Define your MVP features and create compelling product tiers",
    path: "/offer-design",
    emoji: "📦",
  },
  {
    title: "Pricing Strategy Advisor",
    description: "Choose your pricing model and calculate optimal price points",
    path: "/pricing-strategy",
    emoji: "💰",
  },
  {
    title: "Distribution & GTM Planner",
    description: "Select channels, design your funnel, and build a 90-day launch plan",
    path: "/gtm-planner",
    emoji: "🚀",
  },
  {
    title: "Messaging & Copy Generator",
    description: "Create on-brand copy for landing pages, emails, and social media",
    path: "/messaging-copy",
    emoji: "✍️",
  },
  {
    title: "Simple Financials & Milestones",
    description: "Project revenue, plan expenses, and set key business milestones",
    path: "/financials",
    emoji: "📊",
  },
  {
    title: "Risk, Compliance & Ops",
    description: "Legal templates, brand protection, and operational readiness",
    path: "/risk-compliance",
    emoji: "⚖️",
  },
  {
    title: "Investor/Partner One-Pager",
    description: "Generate pitch materials and elevator pitches from your business data",
    path: "/investor-one-pager",
    emoji: "📄",
  },
];

export const Dashboard = () => {
  const [commandInput, setCommandInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [workflowPreview, setWorkflowPreview] = useState<any>(null);
  const { toast } = useToast();

  const handleCommandSubmit = async () => {
    if (!commandInput.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-workflow-command', {
        body: { command: commandInput },
      });

      if (error) throw error;

      console.log('Parsed workflow:', data);
      setWorkflowPreview({
        ...data,
        workflowType: data.workflow_type
      });
      setCommandInput("");
    } catch (error) {
      console.error('Error parsing command:', error);
      toast({
        title: "Error",
        description: "Failed to parse command. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandSubmit();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header with Centered Search */}
      <div className="px-12 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Vibe Business Toolbox</h1>
          <p className="text-sm text-grey-500">Launch your tech business with AI-powered workflows</p>
        </div>
        
        {/* Centered Command Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Describe what you need... (e.g., 'help me validate my SaaS idea', 'create a pricing strategy')"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 text-sm border border-input bg-background text-foreground placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg transition-all disabled:opacity-50 shadow-sm"
            />
            <Button
              onClick={handleCommandSubmit}
              disabled={isProcessing || !commandInput.trim()}
              className="px-6 whitespace-nowrap"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Workflow'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-12 py-6 space-y-10">
        {/* Start a Workflow Section */}
        <section>
          <h2 className="text-base font-semibold mb-4 text-foreground">
            Start a Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {workflows.map((workflow) => (
              <WorkflowCard key={workflow.path} {...workflow} />
            ))}
          </div>
        </section>
      </div>

      {/* Workflow Preview Modal */}
      {workflowPreview && (
        <WorkflowPreview
          {...workflowPreview}
          onClose={() => setWorkflowPreview(null)}
        />
      )}
    </div>
  );
};
