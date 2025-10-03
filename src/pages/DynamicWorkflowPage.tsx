import { useParams, Navigate } from 'react-router-dom';
import { WorkflowPage } from '@/components/features/WorkflowPage';
import { configService } from '@/services/config.service';

export const DynamicWorkflowPage = () => {
  const { workflowPath } = useParams<{ workflowPath: string }>();
  const fullPath = `/${workflowPath}`;
  
  const workflow = configService.getWorkflowByPath(fullPath);
  
  if (!workflow) {
    return <Navigate to="/" replace />;
  }
  
  const exampleCommand = configService.getWorkflowExampleCommand(fullPath);
  
  return (
    <WorkflowPage
      workflowType={workflow.type}
      title={workflow.title}
      description={workflow.description}
      exampleCommand={exampleCommand}
    />
  );
};