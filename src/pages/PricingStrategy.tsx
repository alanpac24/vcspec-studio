import { WorkflowPage } from "@/components/WorkflowPage";

const PricingStrategy = () => {
  return (
    <WorkflowPage
      workflowType="pricing-strategy"
      title="Pricing Strategy Advisor"
      description="Select the optimal pricing model, calculate price points, and craft value-focused pricing messaging"
      exampleCommand="Help me figure out pricing for my subscription product"
    />
  );
};

export default PricingStrategy;
