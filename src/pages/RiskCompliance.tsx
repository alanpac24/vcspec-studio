import { WorkflowPage } from "@/components/features/WorkflowPage";

const RiskCompliance = () => {
  return (
    <WorkflowPage
      workflowType="risk-compliance"
      title="Risk, Compliance & Ops Readiness"
      description="Get legal templates, protect your brand, and identify operational dependencies"
      exampleCommand="What legal and operational things do I need to handle before launch?"
    />
  );
};

export default RiskCompliance;
