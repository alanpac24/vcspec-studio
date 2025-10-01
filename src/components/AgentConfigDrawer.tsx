import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PipedreamConnect } from "./PipedreamConnect";

interface Agent {
  id: string;
  name: string;
  description: string;
  ai_prompt?: string | null;
  integration_config?: any;
  integrations: string[];
}

interface AgentConfigDrawerProps {
  agent: Agent;
  onClose: () => void;
  onSaved: () => void;
}

export const AgentConfigDrawer = ({ agent, onClose, onSaved }: AgentConfigDrawerProps) => {
  const [aiPrompt, setAiPrompt] = useState(agent.ai_prompt || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('agent_configs')
        .update({
          ai_prompt: aiPrompt || null,
        })
        .eq('id', agent.id);

      if (error) throw error;

      toast({
        title: "Agent Updated",
        description: "Configuration saved successfully",
      });
      
      onSaved();
      onClose();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save agent",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{agent.name}</h2>
            <p className="text-sm text-grey-600">{agent.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-grey-400 hover:text-grey-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* AI Prompt Section */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-semibold">AI Prompt</Label>
              <p className="text-xs text-grey-500 mt-1">
                Define what this agent should do with the data. Leave empty for webhook-only agents.
              </p>
            </div>
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Analyze the deal data and score it 0-100 based on stage, traction, and team quality. Return JSON with scores and reasoning."
              rows={6}
              className="text-sm font-mono"
            />
            <p className="text-xs text-grey-500">
              💡 The AI will receive data from the previous agent and process it according to this prompt.
            </p>
          </div>

          {/* Integrations Section */}
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-semibold">Connected Integrations</Label>
              <p className="text-xs text-grey-500 mt-1">
                Connect {agent.integrations.join(', ')} to enable real-time data fetching
              </p>
            </div>
            <div className="space-y-3">
              {agent.integrations.map((integration) => (
                <PipedreamConnect
                  key={integration}
                  appName={integration}
                />
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="p-4 bg-background border border-border space-y-2">
            <h3 className="text-sm font-semibold">How This Works</h3>
            <div className="text-xs text-grey-600 space-y-1">
              <p><strong>AI Only:</strong> Set AI prompt - agent processes data with Gemini</p>
              <p><strong>With Integrations:</strong> Connect apps above - agent fetches real data via Pipedream, then processes with AI</p>
              <p><strong>Web Search:</strong> Use "Search the web..." in prompts for real-time data</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>
    </div>
  );
};
