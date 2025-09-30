import { RunsTable } from "@/components/RunsTable";

const runs = [
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
  {
    time: "Yesterday 6:15 PM",
    workflow: "Research & Outbound",
    agents: 4,
    status: "Success",
  },
  {
    time: "Yesterday 3:45 PM",
    workflow: "Dealflow Triage",
    agents: 4,
    status: "Error",
  },
  {
    time: "Yesterday 1:20 PM",
    workflow: "Meeting Prep",
    agents: 3,
    status: "Success",
  },
  {
    time: "Yesterday 10:00 AM",
    workflow: "CRM Hygiene",
    agents: 3,
    status: "Success",
  },
];

const RunsPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-12 pt-12 pb-2">
        <h1 className="text-3xl font-bold text-foreground mb-1">Runs</h1>
        <p className="text-sm text-grey-500">View execution history and details</p>
      </div>
      <div className="px-12 py-6">
        <RunsTable runs={runs} />
      </div>
    </div>
  );
};

export default RunsPage;
