import { useNavigate } from "react-router-dom";

interface WorkflowCardProps {
  title: string;
  description: string;
  path: string;
  emoji: string;
}

export const WorkflowCard = ({ title, description, path, emoji }: WorkflowCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="group border border-border bg-card p-5 text-left hover:bg-grey-50 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{emoji}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground mb-1.5 group-hover:text-grey-900 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-grey-500 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};
