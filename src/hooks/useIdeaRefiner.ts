import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { IdeaRefinerInput, IdeaRefinerOutput, DiagnosticQuestion } from '@/types/idea-refiner';

// Default diagnostic questions
const defaultDiagnosticQuestions: Omit<DiagnosticQuestion, 'answer'>[] = [
  {
    id: '1',
    question: 'What specific problem are you solving, and who experiences this problem most acutely?',
    category: 'problem',
    followUpQuestions: [
      'How frequently does this problem occur?',
      'What are the current workarounds or solutions?',
      'What is the cost of not solving this problem?'
    ]
  },
  {
    id: '2',
    question: 'Describe your ideal customer in detail. What are their demographics, behaviors, and motivations?',
    category: 'audience',
    followUpQuestions: [
      'What is their job title or role?',
      'What is their typical day like?',
      'What are their biggest frustrations?'
    ]
  },
  {
    id: '3',
    question: 'Why is now the right time for this solution? What market trends or changes make this timely?',
    category: 'timing',
    followUpQuestions: [
      'What recent technology or market shifts enable this?',
      'What happens if you wait another year?',
      'Are there regulatory or social changes supporting this?'
    ]
  },
  {
    id: '4',
    question: 'How does your solution work? Walk through the user experience step by step.',
    category: 'solution',
    followUpQuestions: [
      'What is the core functionality?',
      'How long does it take to see value?',
      'What are the key features vs nice-to-haves?'
    ]
  },
  {
    id: '5',
    question: 'What makes your solution unique compared to existing alternatives? Why would customers switch?',
    category: 'differentiation',
    followUpQuestions: [
      'What is your unfair advantage?',
      'What would be hardest for competitors to copy?',
      'How do you deliver 10x better results?'
    ]
  }
];

export const useIdeaRefiner = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processIdea = async (input: IdeaRefinerInput): Promise<IdeaRefinerOutput | null> => {
    setIsProcessing(true);
    
    try {
      // Prepare the diagnostic questions
      const diagnosticQuestions: DiagnosticQuestion[] = [
        ...defaultDiagnosticQuestions.map(q => ({ ...q, answer: '' })),
        ...(input.customQuestions?.map((q, index) => ({
          id: `custom-${index}`,
          question: q,
          category: 'problem' as const,
          answer: ''
        })) || [])
      ];

      // For now, return a mock response since we need to implement the backend
      // In production, this would call the Supabase Edge Function
      const mockOutput: IdeaRefinerOutput = {
        diagnosticAnswers: diagnosticQuestions,
        customerSegments: [
          {
            id: '1',
            name: 'Early Adopter Startups',
            description: 'Tech startups in seed to Series A stage',
            demographics: {
              age: '25-40',
              location: 'Major tech hubs',
              income: '$50k-$150k',
              occupation: 'Founders, Product Managers'
            },
            psychographics: {
              values: ['Innovation', 'Efficiency', 'Growth'],
              interests: ['Technology', 'Entrepreneurship', 'Productivity'],
              painPoints: ['Time constraints', 'Resource limitations', 'Scaling challenges'],
              goals: ['Rapid growth', 'Product-market fit', 'Funding success']
            },
            size: 50000,
            accessibility: 'high'
          }
        ],
        idealCustomerProfiles: [],
        problemSolutionFit: {
          problems: [],
          solution: {
            description: '',
            keyFeatures: [],
            uniqueValue: [],
            implementation: ''
          },
          fitScore: 0,
          gaps: []
        },
        valueProposition: {
          headline: '',
          subheadline: '',
          benefits: [],
          differentiators: [],
          proofPoints: []
        },
        positioning: {
          statement: '',
          targetMarket: '',
          category: '',
          keyBenefit: '',
          competitiveDifferentiation: '',
          reasonToBelieve: ''
        },
        risksAndAssumptions: [],
        leanCanvas: {
          problem: ['Problem 1', 'Problem 2'],
          solution: ['Solution 1', 'Solution 2'],
          keyMetrics: ['Metric 1', 'Metric 2'],
          uniqueValueProposition: 'Your unique value prop',
          unfairAdvantage: 'Your competitive moat',
          channels: ['Channel 1', 'Channel 2'],
          customerSegments: ['Segment 1', 'Segment 2'],
          costStructure: ['Cost 1', 'Cost 2'],
          revenueStreams: ['Revenue 1', 'Revenue 2']
        },
        summary: {
          ideaStrength: 75,
          readinessLevel: 'concept',
          nextSteps: ['Validate with target customers', 'Build MVP', 'Test pricing'],
          criticalRisks: ['Market timing', 'Competition', 'Technical feasibility']
        }
      };

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Analysis Started",
        description: "Your idea is being analyzed. This may take a few moments.",
      });

      return mockOutput;

      // Production code would be:
      // const { data, error } = await supabase.functions.invoke('idea-refiner', {
      //   body: { input }
      // });
      // 
      // if (error) throw error;
      // return data as IdeaRefinerOutput;

    } catch (error) {
      console.error('Error processing idea:', error);
      toast({
        title: "Error",
        description: "Failed to process your idea. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processIdea,
    isProcessing
  };
};