interface Run {
  time: string;
  workflow: string;
  agents: number;
  status: string;
}

interface RunsTableProps {
  runs: Run[];
}

const getStatusColor = (status: string) => {
  if (status === "Success") return "text-grey-700";
  if (status === "Needs Approval") return "text-grey-900 font-medium";
  return "text-grey-500";
};

export const RunsTable = ({ runs }: RunsTableProps) => {
  return (
    <div className="border border-border bg-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-grey-50">
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
              Time
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
              Workflow
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
              Agents
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-grey-600 uppercase tracking-wide">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run, idx) => (
            <tr 
              key={idx} 
              className="border-b border-border last:border-b-0 hover:bg-grey-50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3 text-sm text-grey-600">{run.time}</td>
              <td className="px-4 py-3 text-sm text-foreground font-medium">{run.workflow}</td>
              <td className="px-4 py-3 text-sm text-grey-600">{run.agents}</td>
              <td className="px-4 py-3 text-sm">
                <span className={getStatusColor(run.status)}>
                  {run.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
