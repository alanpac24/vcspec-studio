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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 border-b border-border pb-3">Runs</h1>
      <RunsTable runs={runs} />
    </div>
  );
};

export default RunsPage;
