interface Run {
  time: string;
  workflow: string;
  agents: number;
  status: string;
}

interface RunsTableProps {
  runs: Run[];
}

export const RunsTable = ({ runs }: RunsTableProps) => {
  return (
    <div className="border border-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-grey-light">
            <th className="text-left p-3 text-sm font-bold">Time</th>
            <th className="text-left p-3 text-sm font-bold">Workflow</th>
            <th className="text-left p-3 text-sm font-bold">Agents</th>
            <th className="text-left p-3 text-sm font-bold">Status</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run, idx) => (
            <tr key={idx} className="border-b border-border hover:bg-grey-light transition-colors">
              <td className="p-3 text-sm">{run.time}</td>
              <td className="p-3 text-sm">{run.workflow}</td>
              <td className="p-3 text-sm">{run.agents}</td>
              <td className="p-3 text-sm">
                <span
                  className={`px-2 py-1 border ${
                    run.status === "Success"
                      ? "bg-background border-border"
                      : "bg-grey-light border-border"
                  }`}
                >
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
