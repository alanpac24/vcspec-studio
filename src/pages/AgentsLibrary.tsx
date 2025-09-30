import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const agents = [
  {
    name: "Inbound Capture Agent",
    purpose: "Monitor multiple channels for new deal opportunities",
    inputs: "Email, forms, LinkedIn",
    outputs: "Structured deal record",
    integrations: "Gmail, LinkedIn, Forms",
    lastUsed: "2 hours ago",
  },
  {
    name: "Enrichment Agent",
    purpose: "Pull external data on companies and founders",
    inputs: "Company domain",
    outputs: "Enriched profile",
    integrations: "Crunchbase, PitchBook",
    lastUsed: "2 hours ago",
  },
  {
    name: "Scoring Agent",
    purpose: "Score deals based on fit criteria",
    inputs: "Enriched profile",
    outputs: "Fit score (0-100)",
    integrations: "Custom ML Model",
    lastUsed: "2 hours ago",
  },
  {
    name: "Routing Agent",
    purpose: "Assign owners and send notifications",
    inputs: "Scored deal",
    outputs: "CRM record, Slack alert",
    integrations: "Pipedrive, Slack",
    lastUsed: "2 hours ago",
  },
  {
    name: "Brief Builder Agent",
    purpose: "Generate meeting preparation documents",
    inputs: "Calendar event, CRM data",
    outputs: "Formatted brief",
    integrations: "Notion, Slack",
    lastUsed: "5 hours ago",
  },
  {
    name: "Data Quality Agent",
    purpose: "Identify and fix CRM data issues",
    inputs: "CRM records",
    outputs: "Suggested corrections",
    integrations: "Pipedrive",
    lastUsed: "Yesterday",
  },
];

const AgentsLibrary = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-12 pt-12 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Agents Library</h1>
            <p className="text-sm text-grey-500">Browse and configure your automation agents</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-grey-800 h-9 px-4 text-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Button>
        </div>
      </div>

      <div className="px-12 py-6">
        <div className="border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-grey-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
                  Purpose
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
                  Inputs
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
                  Outputs
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
                  Integrations
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
                  Last Used
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-border last:border-b-0 hover:bg-grey-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{agent.name}</td>
                  <td className="px-4 py-3 text-sm text-grey-600">{agent.purpose}</td>
                  <td className="px-4 py-3 text-sm text-grey-600">{agent.inputs}</td>
                  <td className="px-4 py-3 text-sm text-grey-600">{agent.outputs}</td>
                  <td className="px-4 py-3 text-sm text-grey-600">{agent.integrations}</td>
                  <td className="px-4 py-3 text-sm text-grey-500">{agent.lastUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentsLibrary;
