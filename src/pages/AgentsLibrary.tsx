import { Button } from "@/components/ui/button";

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-3">
        <h1 className="text-2xl font-bold">Agents Library</h1>
        <Button className="bg-primary text-primary-foreground">New Agent</Button>
      </div>

      <div className="border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-grey-light">
              <th className="text-left p-3 text-sm font-bold">Name</th>
              <th className="text-left p-3 text-sm font-bold">Purpose</th>
              <th className="text-left p-3 text-sm font-bold">Inputs</th>
              <th className="text-left p-3 text-sm font-bold">Outputs</th>
              <th className="text-left p-3 text-sm font-bold">Integrations</th>
              <th className="text-left p-3 text-sm font-bold">Last Used</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-grey-light transition-colors">
                <td className="p-3 text-sm font-medium">{agent.name}</td>
                <td className="p-3 text-sm text-muted-foreground">{agent.purpose}</td>
                <td className="p-3 text-sm text-muted-foreground">{agent.inputs}</td>
                <td className="p-3 text-sm text-muted-foreground">{agent.outputs}</td>
                <td className="p-3 text-sm text-muted-foreground">{agent.integrations}</td>
                <td className="p-3 text-sm text-muted-foreground">{agent.lastUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsLibrary;
