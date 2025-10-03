import { WorkflowCategory, Workflow } from '@/types/workflow';
import { workflowCategories } from '@/config/workflows';

export interface AppConfig {
  appName: string;
  appDescription: string;
  apiBaseUrl: string;
  version: string;
  features: {
    auth: boolean;
    analytics: boolean;
    darkMode: boolean;
  };
}

class ConfigService {
  private static instance: ConfigService;
  private workflowMap: Map<string, Workflow> = new Map();
  private workflowTypeMap: Map<string, Workflow> = new Map();
  
  private appConfig: AppConfig = {
    appName: 'VC Studio',
    appDescription: 'Your AI-powered venture capital assistant',
    apiBaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    version: '1.0.0',
    features: {
      auth: true,
      analytics: false,
      darkMode: true
    }
  };

  private constructor() {
    this.initializeWorkflowMaps();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private initializeWorkflowMaps(): void {
    workflowCategories.forEach(category => {
      category.workflows.forEach(workflow => {
        this.workflowMap.set(workflow.path, workflow);
        this.workflowTypeMap.set(workflow.type, workflow);
      });
    });
  }

  // App configuration methods
  getAppConfig(): AppConfig {
    return { ...this.appConfig };
  }

  updateAppConfig(updates: Partial<AppConfig>): void {
    this.appConfig = { ...this.appConfig, ...updates };
  }

  getFeatureFlag(feature: keyof AppConfig['features']): boolean {
    return this.appConfig.features[feature];
  }

  // Workflow configuration methods
  getWorkflowCategories(): WorkflowCategory[] {
    return workflowCategories;
  }

  getWorkflowByPath(path: string): Workflow | undefined {
    return this.workflowMap.get(path);
  }

  getWorkflowByType(type: string): Workflow | undefined {
    return this.workflowTypeMap.get(type);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflowMap.values());
  }

  getWorkflowsByCategory(categoryTitle: string): Workflow[] {
    const category = workflowCategories.find(cat => cat.title === categoryTitle);
    return category ? category.workflows : [];
  }

  // Utility methods
  isValidWorkflowPath(path: string): boolean {
    return this.workflowMap.has(path);
  }

  isValidWorkflowType(type: string): boolean {
    return this.workflowTypeMap.has(type);
  }

  getWorkflowExampleCommand(workflowPath: string): string {
    const exampleCommands: Record<string, string> = {
      '/idea-refiner': 'Analyze my idea for a sustainable meal delivery service',
      '/mvp-diagnostic': 'Check if my e-commerce platform is MVP-ready',
      '/persona-icp': 'Create personas for a B2B SaaS tool',
      '/feedback-loop': 'Set up feedback channels for my mobile app',
      '/market-sizing': 'Calculate TAM for online education in Southeast Asia',
      '/competitor-analysis': 'Analyze competitors for a fintech startup',
      '/traction-tracker': 'Track early metrics for my marketplace',
      '/pricing-strategy': 'Recommend pricing for a subscription service',
      '/offer-packaging': 'Create pricing tiers for my SaaS product',
      '/revenue-simulator': 'Project revenue for different pricing models',
      '/gtm-planner': 'Create go-to-market plan for B2B software',
      '/funnel-designer': 'Design conversion funnel for e-commerce',
      '/messaging': 'Write launch messaging for productivity app',
      '/social-strategy': 'Plan social media strategy for DTC brand',
      '/content-calendar': 'Generate 30-day content calendar',
      '/launch-checklist': 'Create launch checklist for new feature',
      '/community-playbook': 'Build community strategy for creators',
      '/runway': 'Calculate runway with $100k funding',
      '/forecast': 'Create 12-month financial projection',
      '/cap-table': 'Model cap table with seed round',
      '/investor-one-pager': 'Create one-pager for investors',
      '/pitch-deck': 'Build pitch deck for Series A',
      '/milestone-roadmap': 'Plan milestones for next funding round',
      '/legal-ops': 'Guide me through Delaware C-Corp setup',
      '/hiring': 'Recommend first 3 hires for startup',
      '/productivity': 'Suggest tech stack for remote team',
      '/privacy-security': 'Create GDPR compliance checklist',
      '/legal-docs': 'Draft privacy policy and terms',
      '/risk-ip': 'Assess IP risks for my startup',
      '/metrics': 'Set up KPI dashboard for SaaS',
      '/retention': 'Analyze user retention patterns',
      '/funnel-analytics': 'Track conversion funnel metrics',
      '/narrative': 'Craft founder story for my journey',
      '/naming': 'Generate names for eco-friendly brand',
      '/visual-kit': 'Create visual identity guidelines'
    };

    const workflow = this.getWorkflowByPath(workflowPath);
    if (!workflow) return 'Help me get started';

    return exampleCommands[workflowPath] || `Help me with ${workflow.title.toLowerCase()}`;
  }
}

export const configService = ConfigService.getInstance();