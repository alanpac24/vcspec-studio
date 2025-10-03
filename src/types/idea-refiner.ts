export interface IdeaRefinerInput {
  ideaDescription: string;
  existingDocs?: File[];
  customQuestions?: string[];
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  category: 'problem' | 'audience' | 'timing' | 'solution' | 'differentiation';
  answer?: string;
  followUpQuestions?: string[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  demographics: {
    age?: string;
    location?: string;
    income?: string;
    occupation?: string;
  };
  psychographics: {
    values?: string[];
    interests?: string[];
    painPoints?: string[];
    goals?: string[];
  };
  size: number;
  accessibility: 'high' | 'medium' | 'low';
}

export interface IdealCustomerProfile {
  id: string;
  title: string;
  persona: {
    name: string;
    role: string;
    background: string;
    dayInLife: string;
  };
  problems: string[];
  goals: string[];
  objections: string[];
  buyingProcess: string[];
  segment: CustomerSegment;
}

export interface ProblemSolutionFit {
  problems: {
    id: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    frequency: 'daily' | 'weekly' | 'monthly' | 'occasionally';
    currentSolutions: string[];
  }[];
  solution: {
    description: string;
    keyFeatures: string[];
    uniqueValue: string[];
    implementation: string;
  };
  fitScore: number;
  gaps: string[];
}

export interface ValueProposition {
  headline: string;
  subheadline: string;
  benefits: {
    id: string;
    title: string;
    description: string;
    icon?: string;
  }[];
  differentiators: string[];
  proofPoints: string[];
}

export interface Positioning {
  statement: string;
  targetMarket: string;
  category: string;
  keyBenefit: string;
  competitiveDifferentiation: string;
  reasonToBelieve: string;
}

export interface RiskAssumption {
  id: string;
  type: 'risk' | 'assumption';
  category: 'market' | 'product' | 'technical' | 'financial' | 'team';
  description: string;
  impact: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  mitigation?: string;
  validation?: string;
  status: 'unvalidated' | 'testing' | 'validated' | 'invalidated';
}

export interface LeanCanvas {
  problem: string[];
  solution: string[];
  keyMetrics: string[];
  uniqueValueProposition: string;
  unfairAdvantage: string;
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface BusinessModelCanvas {
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface IdeaRefinerOutput {
  diagnosticAnswers: DiagnosticQuestion[];
  customerSegments: CustomerSegment[];
  idealCustomerProfiles: IdealCustomerProfile[];
  problemSolutionFit: ProblemSolutionFit;
  valueProposition: ValueProposition;
  positioning: Positioning;
  risksAndAssumptions: RiskAssumption[];
  leanCanvas: LeanCanvas;
  businessModelCanvas?: BusinessModelCanvas;
  summary: {
    ideaStrength: number; // 0-100
    readinessLevel: 'concept' | 'validated' | 'ready-to-build';
    nextSteps: string[];
    criticalRisks: string[];
  };
}