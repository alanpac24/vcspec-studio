import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "./WorkflowCard";
import { RunsTable } from "./RunsTable";
import { ApprovalsQueue } from "./ApprovalsQueue";

const workflows = [
  {
    title: "Dealflow Triage",
    description: "Capture, enrich, score, and route inbound deals automatically",
    path: "/dealflow-triage",
  },
  {
    title: "Meeting Preparation",
    description: "Generate meeting briefs with CRM history and external research",
    path: "/meeting-prep",
  },
  {
    title: "CRM Hygiene",
    description: "Dedupe, fill missing fields, and maintain data quality",
    path: "/crm-hygiene",
  },
  {
    title: "Research & Outbound",
    description: "Research companies by thesis, rank fit, draft outreach",
    path: "/research-outbound",
  },
  {
    title: "Portfolio & LP Ops",
    description: "Collect updates, draft LP letters, flag risks",
    path: "/portfolio-lp",
  },
  {
    title: "Fundraising / LP CRM",
    description: "Manage LP relationships and fundraising activities",
    path: "/fundraising",
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
    <div className="p-6 space-y-6">
      {/* Start a Workflow Section */}
      <section>
        <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">
          Start a Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.path} {...workflow} />
          ))}
        </div>
      </section>

      {/* Recent Runs Section */}
      <section>
        <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">
          Recent Runs
        </h2>
        <RunsTable runs={recentRuns} />
      </section>

      {/* Approvals Queue Section */}
      <section>
        <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">
          Approvals Queue
        </h2>
        <ApprovalsQueue approvals={approvals} />
      </section>

      {/* System Health Section */}
      <section>
        <h2 className="text-lg font-bold mb-4 border-b border-border pb-2">
          System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-border p-4">
            <div className="text-2xl font-bold">127</div>
            <div className="text-sm text-muted-foreground">Agent runs today</div>
          </div>
          <div className="border border-border p-4">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Failures</div>
          </div>
          <div className="border border-border p-4">
            <div className="text-2xl font-bold">1.2s</div>
            <div className="text-sm text-muted-foreground">Avg latency</div>
          </div>
        </div>
      </section>
    </div>
  );
};
