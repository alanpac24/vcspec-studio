import { WorkflowPage } from "@/components/features/WorkflowPage";

const MVPDiagnostic = () => {
  return (
    <WorkflowPage
      workflowType="mvp-diagnostic"
      title="MVP Diagnostic"
      description="Test if your product is a launchable MVP with feature completeness checks and usability evaluation"
      exampleCommand="Evaluate if my product is ready to launch"
    />
  );
};

export default MVPDiagnostic;
