import { Users, Settings, FileText, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MeetingPrepPreviewProps {
  activeStep: number;
  currentBrief: any | null;
  isProcessing: boolean;
}

const stepPreviews = {
  1: {
    icon: Users,
    title: "Select Meeting/Contact",
    description: "Enter the contact and company details for your upcoming meeting. The AI will research this person and company to prepare relevant talking points.",
  },
  2: {
    icon: Settings,
    title: "Configure Research Scope",
    description: "Choose which research areas to include. The AI will gather information from news sources, social media, your CRM, and competitive intelligence databases.",
  },
  3: {
    icon: FileText,
    title: "Define Brief Template",
    description: "Customize how the meeting brief should be structured. This template guides the format, sections, and level of detail in the final output.",
  },
  4: {
    icon: Zap,
    title: "Generate Brief",
    description: "The AI will research the contact and company, analyze relevant information, and generate a comprehensive meeting brief based on your configuration.",
  },
};

export const MeetingPrepPreview = ({ activeStep, currentBrief, isProcessing }: MeetingPrepPreviewProps) => {
  const stepConfig = stepPreviews[activeStep as keyof typeof stepPreviews];
  const StepIcon = stepConfig.icon;

  if (activeStep === 4 && (currentBrief || isProcessing)) {
    return (
      <div className="h-full flex flex-col bg-grey-50">
        <div className="bg-background border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Meeting Brief</h2>
          <p className="text-xs text-grey-500 mt-0.5">
            AI-generated preparation for {currentBrief?.contactName || "your meeting"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-grey-600">Researching and generating brief...</p>
              </div>
            </div>
          ) : currentBrief ? (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="border border-border bg-background p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2">Executive Summary</h3>
                <p className="text-sm text-grey-700 leading-relaxed">{currentBrief.executiveSummary}</p>
              </div>

              {/* Tabs for different sections */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="topics">Discussion</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="border border-border bg-background p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Company Overview</h4>
                    <p className="text-sm text-grey-700 mb-3">{currentBrief.companyOverview.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-grey-50 p-3 rounded">
                        <div className="text-xs text-grey-500">Employees</div>
                        <div className="text-sm font-semibold text-foreground">{currentBrief.companyOverview.metrics.employees}</div>
                      </div>
                      <div className="bg-grey-50 p-3 rounded">
                        <div className="text-xs text-grey-500">Funding</div>
                        <div className="text-sm font-semibold text-foreground">{currentBrief.companyOverview.metrics.funding}</div>
                      </div>
                      <div className="bg-grey-50 p-3 rounded">
                        <div className="text-xs text-grey-500">Founded</div>
                        <div className="text-sm font-semibold text-foreground">{currentBrief.companyOverview.metrics.founded}</div>
                      </div>
                    </div>

                    <h5 className="text-xs font-semibold text-foreground mb-2">Recent Updates</h5>
                    <ul className="text-sm text-grey-700 space-y-1">
                      {currentBrief.companyOverview.recentUpdates.map((update: string, idx: number) => (
                        <li key={idx}>• {update}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="topics" className="space-y-4 mt-4">
                  <div className="border border-border bg-background p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Key Discussion Topics</h4>
                    <ul className="text-sm text-grey-700 space-y-2">
                      {currentBrief.keyTopics.map((topic: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary mr-2">→</span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-border bg-background p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Recommended Questions</h4>
                    <ul className="text-sm text-grey-700 space-y-2">
                      {currentBrief.recommendedQuestions.map((question: string, idx: number) => (
                        <li key={idx} className="bg-grey-50 p-2 rounded">
                          <span className="font-medium">{idx + 1}.</span> {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4 mt-4">
                  <div className="border border-border bg-background p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Follow-up Actions</h4>
                    <ul className="text-sm text-grey-700 space-y-2">
                      {currentBrief.followUpActions.map((action: string, idx: number) => (
                        <li key={idx} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-border bg-background p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Research Sources Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentBrief.researchSources.map((source: string) => (
                        <span key={source} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {source.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-grey-50">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <StepIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {stepConfig.title}
            </h2>
            <p className="text-xs text-grey-500">Step {activeStep} of 4</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="border-l-2 border-primary bg-primary/5 p-4 rounded-r-lg">
          <p className="text-sm text-grey-700 leading-relaxed">
            {stepConfig.description}
          </p>
        </div>

        <div className="border border-border bg-background p-4 rounded-lg">
          <h4 className="text-xs font-semibold text-foreground mb-2">How it works</h4>
          <ul className="text-xs text-grey-600 space-y-1.5">
            {activeStep === 1 && (
              <>
                <li>• Enter contact and company details manually or select from CRM</li>
                <li>• Meeting date is optional but helps prioritize research</li>
                <li>• AI will use this information to find relevant data</li>
              </>
            )}
            {activeStep === 2 && (
              <>
                <li>• Select which research areas are most relevant for this meeting</li>
                <li>• AI will search news, social media, CRM history, and competitive intel</li>
                <li>• More sources = more comprehensive brief but longer processing time</li>
              </>
            )}
            {activeStep === 3 && (
              <>
                <li>• Define the structure and format of your meeting brief</li>
                <li>• Specify sections, detail level, and focus areas</li>
                <li>• Template ensures consistency across all meeting preps</li>
              </>
            )}
            {activeStep === 4 && (
              <>
                <li>• AI researches the contact and company across selected sources</li>
                <li>• Information is analyzed and synthesized into key insights</li>
                <li>• Comprehensive brief is generated with talking points and questions</li>
              </>
            )}
          </ul>
        </div>

        {activeStep === 1 && (
          <div className="border border-border bg-background p-4 rounded-lg">
            <h4 className="text-xs font-semibold text-foreground mb-3">Example Preview</h4>
            <div className="text-xs text-grey-600 space-y-2">
              <div className="bg-grey-50 p-2 rounded">
                <strong>Contact:</strong> Sarah Johnson
              </div>
              <div className="bg-grey-50 p-2 rounded">
                <strong>Company:</strong> TechCorp AI
              </div>
              <div className="bg-grey-50 p-2 rounded">
                <strong>Meeting Date:</strong> 2025-10-20
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
