import { WorkflowCard } from "./WorkflowCard";
import { RunsTable } from "./RunsTable";
import { ApprovalsQueue } from "./ApprovalsQueue";

const workflows = [
  {
    title: "Dealflow Triage",
    description: "Capture, enrich, score, and route inbound deals automatically",
    path: "/dealflow-triage",
    emoji: "🎯",
  },
  {
    title: "Meeting Preparation",
    description: "Generate meeting briefs with CRM history and external research",
    path: "/meeting-prep",
    emoji: "📅",
  },
  {
    title: "CRM Hygiene",
    description: "Dedupe, fill missing fields, and maintain data quality",
    path: "/crm-hygiene",
    emoji: "🧹",
  },
  {
    title: "Research & Outbound",
    description: "Research companies by thesis, rank fit, draft outreach",
    path: "/research-outbound",
    emoji: "🔍",
  },
  {
    title: "Portfolio & LP Ops",
    description: "Collect updates, draft LP letters, flag risks",
    path: "/portfolio-lp",
    emoji: "📊",
  },
  {
    title: "Fundraising / LP CRM",
    description: "Manage LP relationships and fundraising activities",
    path: "/fundraising",
    emoji: "💼",
  },
];

const recentRuns = [
  {
    time: "10:23 AM",
    workflow: "Dealflow Triage",
    agents: 4,
    status: "Success",
  },
  {
    time: "9:45 AM",
    workflow: "Meeting Prep",
    agents: 3,
    status: "Success",
  },
  {
    time: "9:12 AM",
    workflow: "CRM Hygiene",
    agents: 3,
    status: "Needs Approval",
  },
  {
    time: "Yesterday 11:30 PM",
    workflow: "Portfolio & LP Ops",
    agents: 5,
    status: "Success",
  },
];

const approvals = [
  {
    item: "CRM Stage Change",
    context: "Move 'Acme AI' from Qualification to Due Diligence",
  },
  {
    item: "Outbound Email",
    context: "Send personalized outreach to 3 AI infrastructure companies",
  },
];

export const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="px-12 pt-12 pb-2">
        <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-grey-500">Start a workflow or monitor recent activity</p>
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

        {/* Recent Runs Section */}
        <section>
          <h2 className="text-base font-semibold mb-4 text-foreground">
            Recent Runs
          </h2>
          <RunsTable runs={recentRuns} />
        </section>

        {/* Approvals Queue Section */}
        <section>
          <h2 className="text-base font-semibold mb-4 text-foreground">
            Approvals Queue
          </h2>
          <ApprovalsQueue approvals={approvals} />
        </section>

        {/* System Health Section */}
        <section>
          <h2 className="text-base font-semibold mb-4 text-foreground">
            System Health
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-border bg-card hover:bg-grey-50 transition-colors p-5">
              <div className="text-2xl font-bold text-foreground">127</div>
              <div className="text-sm text-grey-500 mt-1">Agent runs today</div>
            </div>
            <div className="border border-border bg-card hover:bg-grey-50 transition-colors p-5">
              <div className="text-2xl font-bold text-foreground">3</div>
              <div className="text-sm text-grey-500 mt-1">Failures</div>
            </div>
            <div className="border border-border bg-card hover:bg-grey-50 transition-colors p-5">
              <div className="text-2xl font-bold text-foreground">1.2s</div>
              <div className="text-sm text-grey-500 mt-1">Avg latency</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
