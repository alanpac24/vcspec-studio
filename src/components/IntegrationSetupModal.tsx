import { X, ExternalLink, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Integration {
  name: string;
  status: 'needed' | 'connected';
}

interface IntegrationSetupModalProps {
  integrations: Integration[];
  workflowName: string;
  onClose: () => void;
  onContinue: () => void;
}

export const IntegrationSetupModal = ({
  integrations,
  workflowName,
  onClose,
  onContinue,
}: IntegrationSetupModalProps) => {
  const allConnected = integrations.every(i => i.status === 'connected');
  const [connectingApp, setConnectingApp] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-2xl border border-border">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Setup Integrations</h2>
            <p className="text-sm text-grey-600">{workflowName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-grey-400 hover:text-grey-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <Zap className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-900">
                <strong>Pipedream Connect Enabled!</strong> One-click authentication for {integrations.length} integration{integrations.length !== 1 ? 's' : ''}.
              </p>
            </div>

            <p className="text-sm text-grey-700">
              Connect these apps to enable real-time data fetching and automation:
            </p>

            <div className="space-y-3">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between p-4 border border-border bg-grey-50 rounded"
                >
                  <div className="flex items-center gap-3">
                    {integration.status === 'connected' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-grey-300 rounded-full" />
                    )}
                    <div>
                      <div className="font-medium text-sm capitalize">{integration.name.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-grey-500">
                        {integration.status === 'connected' ? 'Connected & Ready' : 'Click to connect'}
                      </div>
                    </div>
                  </div>
                  {integration.status !== 'connected' && (
                    <Button
                      variant="default"
                      size="sm"
                      disabled={connectingApp === integration.name}
                      onClick={() => {
                        setConnectingApp(integration.name);
                        // In production, this would open Pipedream Connect Link
                        // For now, open Pipedream docs
                        window.open(`https://pipedream.com/apps/${integration.name}`, '_blank');
                        setTimeout(() => setConnectingApp(null), 2000);
                      }}
                    >
                      {connectingApp === integration.name ? 'Connecting...' : 'Connect Now'}
                      <Zap className="h-3 w-3 ml-2" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-background border border-border rounded space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Pipedream Connect Benefits:
            </h3>
            <ul className="text-sm text-grey-700 space-y-2 list-disc list-inside">
              <li>One-click OAuth authentication (no manual setup)</li>
              <li>Automatic token refresh and management</li>
              <li>Real-time data from 2,800+ APIs</li>
              <li>Secure credential storage (never stored locally)</li>
              <li>Pre-built integrations ready to use</li>
            </ul>
            <a
              href="https://pipedream.com/docs/connect"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn about Pipedream Connect
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onContinue}>
            {allConnected ? 'Continue' : 'Skip for Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};
