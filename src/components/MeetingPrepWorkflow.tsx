import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, Users, Settings, FileText, Play, Zap, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MeetingPrepWorkflowProps {
  onBriefGenerated: (brief: any) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onActiveStepChange: (step: number) => void;
}

const workflowSteps = [
  {
    id: 1,
    icon: Users,
    title: "Select Meeting/Contact",
    description: "Choose contact or enter meeting details",
  },
  {
    id: 2,
    icon: Settings,
    title: "Configure Research Scope",
    description: "Define what information to gather",
  },
  {
    id: 3,
    icon: FileText,
    title: "Define Brief Template",
    description: "Customize the output format",
  },
  {
    id: 4,
    icon: Zap,
    title: "Generate Brief",
    description: "Run AI research and create brief",
  },
];

const researchOptions = [
  { id: "recent-news", label: "Recent News & Press", description: "Latest company announcements and media coverage" },
  { id: "competitive", label: "Competitive Intelligence", description: "Market position and competitor analysis" },
  { id: "company-updates", label: "Company Updates", description: "Product launches, funding, team changes" },
  { id: "social-profiles", label: "Social Profiles", description: "LinkedIn, Twitter activity and insights" },
  { id: "crm-history", label: "CRM History", description: "Previous interactions and notes" },
];

export const MeetingPrepWorkflow = ({
  onBriefGenerated,
  onProcessingChange,
  onActiveStepChange,
}: MeetingPrepWorkflowProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [selectedResearch, setSelectedResearch] = useState<string[]>(["recent-news", "crm-history"]);
  const [briefTemplate, setBriefTemplate] = useState(
    `Generate a comprehensive meeting brief with:

1. Executive Summary (2-3 sentences)
2. Company Overview & Recent Updates
3. Key Discussion Topics
4. Recommended Questions
5. Follow-up Actions

Format the output with clear sections and bullet points.`
  );

  const { toast } = useToast();

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return contactName.trim().length > 0 && companyName.trim().length > 0;
      case 2:
        return selectedResearch.length > 0;
      case 3:
        return briefTemplate.trim().length > 0;
      case 4:
        return false;
      default:
        return false;
    }
  };

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    onActiveStepChange(stepId);
  };

  const handleResearchToggle = (optionId: string) => {
    setSelectedResearch((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleGenerateBrief = async () => {
    if (!contactName || !companyName) {
      toast({
        title: "Missing information",
        description: "Please enter contact and company details",
        variant: "destructive",
      });
      return;
    }

    if (selectedResearch.length === 0) {
      toast({
        title: "No research selected",
        description: "Please select at least one research area",
        variant: "destructive",
      });
      return;
    }

    setActiveStep(4);
    onActiveStepChange(4);
    onProcessingChange(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const mockBrief = {
        contactName,
        companyName,
        meetingDate: meetingDate || "TBD",
        executiveSummary: `${companyName} is a rapidly growing company in the AI/ML space. Recent funding and product launches indicate strong market traction. ${contactName} is interested in discussing partnership opportunities.`,
        companyOverview: {
          description: `${companyName} provides AI-powered solutions for enterprise customers.`,
          recentUpdates: [
            "Announced Series B funding of $25M led by Sequoia Capital",
            "Launched new product feature: AI-powered analytics dashboard",
            "Expanded team to 50+ employees across 3 offices",
          ],
          metrics: {
            employees: "50+",
            funding: "$25M Series B",
            founded: "2021",
          },
        },
        keyTopics: [
          "Partnership opportunities in AI/ML infrastructure",
          "Go-to-market strategy and enterprise sales",
          "Technical integration requirements",
          "Pricing and commercial terms",
        ],
        recommendedQuestions: [
          "What are your primary growth challenges in the next 6-12 months?",
          "How do you differentiate from competitors like X and Y?",
          "What does your ideal partnership look like?",
          "What are your key metrics and traction to date?",
        ],
        followUpActions: [
          "Send product demo request",
          "Connect with technical team for integration discussion",
          "Share partnership proposal template",
        ],
        researchSources: selectedResearch,
      };

      onBriefGenerated(mockBrief);

      toast({
        title: "Brief generated",
        description: "Meeting preparation complete",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate brief",
        variant: "destructive",
      });
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">
          Meeting Preparation Workflow
        </h2>
        <p className="text-xs text-grey-500 mt-0.5">
          Expand each step to prepare for your meeting
        </p>
      </div>

      {/* Accordion Workflow Steps */}
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="single"
          collapsible
          value={`step-${activeStep}`}
          onValueChange={(value) => {
            const stepId = value ? parseInt(value.replace('step-', '')) : activeStep;
            handleStepClick(stepId);
          }}
          className="p-6 space-y-3"
        >
          {/* Step 1: Select Meeting/Contact */}
          <AccordionItem value="step-1" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  {isStepComplete(1) ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activeStep === 1 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                    }`}>
                      1
                    </div>
                  )}
                </div>

                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 1 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <Users className={`h-5 w-5 ${
                    activeStep === 1 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 1 ? "text-primary" : "text-foreground"
                  }`}>
                    Select Meeting/Contact
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Choose contact or enter meeting details
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs">Contact Name *</Label>
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g., John Smith"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Company Name *</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Acme AI"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Meeting Date (Optional)</Label>
                  <Input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="text-xs text-grey-500 bg-grey-50 p-3 rounded border border-grey-200">
                  💡 In production, this would connect to your CRM to pull existing contacts
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 2: Configure Research Scope */}
          <AccordionItem value="step-2" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  {isStepComplete(2) ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activeStep === 2 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                    }`}>
                      2
                    </div>
                  )}
                </div>

                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 2 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <Settings className={`h-5 w-5 ${
                    activeStep === 2 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 2 ? "text-primary" : "text-foreground"
                  }`}>
                    Configure Research Scope
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Define what information to gather
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <p className="text-xs text-grey-500">
                  Select the research areas to include in your brief
                </p>

                <div className="space-y-3">
                  {researchOptions.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3 border border-border bg-card p-3 rounded-lg">
                      <Checkbox
                        id={option.id}
                        checked={selectedResearch.includes(option.id)}
                        onCheckedChange={() => handleResearchToggle(option.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={option.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {option.label}
                        </label>
                        <p className="text-xs text-grey-500 mt-0.5">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 3: Define Brief Template */}
          <AccordionItem value="step-3" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  {isStepComplete(3) ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activeStep === 3 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                    }`}>
                      3
                    </div>
                  )}
                </div>

                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 3 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <FileText className={`h-5 w-5 ${
                    activeStep === 3 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 3 ? "text-primary" : "text-foreground"
                  }`}>
                    Define Brief Template
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Customize the output format
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs">Brief Instructions</Label>
                  <Textarea
                    value={briefTemplate}
                    onChange={(e) => setBriefTemplate(e.target.value)}
                    rows={10}
                    className="text-xs font-mono"
                    placeholder="Define how the brief should be structured..."
                  />
                  <p className="text-xs text-grey-500">
                    💡 These instructions guide the AI on how to format the meeting brief
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 4: Generate Brief */}
          <AccordionItem value="step-4" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    activeStep === 4 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                  }`}>
                    4
                  </div>
                </div>

                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 4 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <Zap className={`h-5 w-5 ${
                    activeStep === 4 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 4 ? "text-primary" : "text-foreground"
                  }`}>
                    Generate Brief
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Run AI research and create brief
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="border border-border bg-card p-4 rounded-lg space-y-2">
                  <div className="text-xs text-grey-600">
                    <p><strong>Contact:</strong> {contactName || "Not specified"}</p>
                    <p><strong>Company:</strong> {companyName || "Not specified"}</p>
                    <p><strong>Research Areas:</strong> {selectedResearch.length} selected</p>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateBrief}
                  disabled={!contactName || !companyName || selectedResearch.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-grey-800"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Generate Meeting Brief
                </Button>

                {(!contactName || !companyName || selectedResearch.length === 0) && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded">
                    ⚠️ Complete Steps 1 and 2 before generating the brief
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
