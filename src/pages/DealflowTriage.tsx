import { WorkflowMapView } from "@/components/WorkflowMapView";

const agents = [
  {
    id: "1",
    name: "Inbound Capture Agent",
    description: "Monitors Gmail, forms, LinkedIn intros for new deal opportunities",
    inputs: "Email threads, form submissions, LinkedIn messages",
    outputs: "Structured deal record with company name, founder, source",
    integrations: ["Gmail", "LinkedIn", "Forms"],
  },
  {
    id: "2",
    name: "Enrichment Agent",
    description: "Pulls external data on company, founders, traction, funding",
    inputs: "Company domain or name",
    outputs: "Enriched profile with metrics, team, investors, news",
    integrations: ["Crunchbase", "PitchBook", "Dealroom"],
  },
  {
    id: "3",
    name: "Scoring Agent",
    description: "Scores deals based on stage, sector, traction, founder fit",
    inputs: "Enriched company profile",
    outputs: "Fit score (0-100) and priority ranking",
    integrations: ["Custom ML Model"],
  },
  {
    id: "4",
    name: "Routing & Notification Agent",
    description: "Assigns owner in Pipedrive and sends Slack alerts",
    inputs: "Scored deal with recommended owner",
    outputs: "CRM record created, Slack notification sent",
    integrations: ["Pipedrive", "Slack"],
  },
];

const DealflowTriage = () => {
  return <WorkflowMapView title="Dealflow Triage" agents={agents} />;
};

export default DealflowTriage;
