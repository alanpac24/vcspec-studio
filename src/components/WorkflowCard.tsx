import { useNavigate } from "react-router-dom";

interface WorkflowCardProps {
  title: string;
  description: string;
  path: string;
}

export const WorkflowCard = ({ title, description, path }: WorkflowCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="border border-border p-4 text-left hover:bg-grey-light transition-colors"
    >
      <h3 className="font-bold text-base mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </button>
  );
};
