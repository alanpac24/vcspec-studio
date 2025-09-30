import { X, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <p className="text-sm text-grey-700">
              This workflow requires the following integrations. Connect them via Pipedream to enable data fetching:
            </p>

            <div className="space-y-3">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between p-4 border border-border bg-grey-50"
                >
                  <div className="flex items-center gap-3">
                    {integration.status === 'connected' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-grey-300 rounded-full" />
                    )}
                    <div>
                      <div className="font-medium text-sm">{integration.name}</div>
                      <div className="text-xs text-grey-500">
                        {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  {integration.status !== 'connected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('https://pipedream.com/new', '_blank')}
                    >
                      Connect via Pipedream
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-background border border-border space-y-3">
            <h3 className="text-sm font-semibold">How to Connect:</h3>
            <ol className="text-sm text-grey-700 space-y-2 list-decimal list-inside">
              <li>Click "Connect via Pipedream" for each integration</li>
              <li>Authorize the app in Pipedream</li>
              <li>Create a workflow that fetches the data you need</li>
              <li>Copy the webhook URL from Pipedream</li>
              <li>Paste it in each agent's configuration</li>
            </ol>
            <a
              href="https://pipedream.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              View Pipedream Documentation
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
