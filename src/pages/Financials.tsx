import { WorkflowPage } from "@/components/features/WorkflowPage";

const Financials = () => {
  return (
    <WorkflowPage
      workflowType="financials"
      title="Simple Financials & Milestones"
      description="Build a lean expense budget, project revenue scenarios, and define key business milestones"
      exampleCommand="Help me create financial projections for my first year"
    />
  );
};

export default Financials;
