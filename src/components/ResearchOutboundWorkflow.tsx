import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Target, Settings, Search, Mail, Zap, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResearchOutboundWorkflowProps {
  onResultsGenerated: (results: any) => void;
  onProcessingChange: (isProcessing: boolean) => void;
  onActiveStepChange: (step: number) => void;
}

const workflowSteps = [
  {
    id: 1,
    icon: Target,
    title: "Define Investment Thesis",
    description: "Specify criteria and focus areas",
  },
  {
    id: 2,
    icon: Settings,
    title: "Configure Search Parameters",
    description: "Set filters and search scope",
  },
  {
    id: 3,
    icon: Search,
    title: "AI Company Research",
    description: "Run search and rank companies",
  },
  {
    id: 4,
    icon: Mail,
    title: "Draft Outreach",
    description: "Generate personalized emails",
  },
};

export const ResearchOutboundWorkflow = ({
  onResultsGenerated,
  onProcessingChange,
  onActiveStepChange,
}: ResearchOutboundWorkflowProps) => {
  const [activeStep, setActiveStep] = useState(1);
  const [thesis, setThesis] = useState("");
  const [sectors, setSectors] = useState<string[]>(["AI/ML", "Enterprise SaaS"]);
  const [newSector, setNewSector] = useState("");
  const [location, setLocation] = useState("north-america");
  const [stage, setStage] = useState("series-a");
  const [fundingRange, setFundingRange] = useState("1m-10m");
  const [employeeCount, setEmployeeCount] = useState("10-50");

  const { toast } = useToast();

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return thesis.trim().length > 0 && sectors.length > 0;
      case 2:
        return true;
      case 3:
        return false;
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

  const addSector = () => {
    if (newSector.trim() && !sectors.includes(newSector.trim())) {
      setSectors([...sectors, newSector.trim()]);
      setNewSector("");
    }
  };

  const removeSector = (sector: string) => {
    setSectors(sectors.filter(s => s !== sector));
  };

  const handleRunResearch = async () => {
    if (!thesis || sectors.length === 0) {
      toast({
        title: "Missing information",
        description: "Please define your investment thesis and sectors",
        variant: "destructive",
      });
      return;
    }

    setActiveStep(3);
    onActiveStepChange(3);
    onProcessingChange(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockResults = {
        companies: [
          {
            id: 1,
            name: "VectorDB Inc",
            score: 92,
            description: "AI-powered vector database for semantic search",
            location: "San Francisco, CA",
            stage: "Series A",
            funding: "$8M",
            employees: "35",
            founded: "2022",
            website: "vectordb.ai",
            fitReason: "Strong alignment with AI infrastructure thesis. Growing market with proven traction.",
          },
          {
            id: 2,
            name: "AutoML Labs",
            score: 88,
            description: "No-code machine learning platform for enterprises",
            location: "New York, NY",
            stage: "Series A",
            funding: "$12M",
            employees: "42",
            founded: "2021",
            website: "automl-labs.com",
            fitReason: "Enterprise focus matches thesis. Strong revenue growth and customer retention.",
          },
          {
            id: 3,
            name: "CloudOps AI",
            score: 85,
            description: "AI-driven cloud infrastructure optimization",
            location: "Austin, TX",
            stage: "Seed",
            funding: "$4M",
            employees: "22",
            founded: "2023",
            website: "cloudops.ai",
            fitReason: "Innovative approach to cost optimization. Early but promising metrics.",
          },
        ],
        searchParams: {
          thesis,
          sectors,
          location,
          stage,
          fundingRange,
          employeeCount,
        },
      };

      onResultsGenerated(mockResults);

      toast({
        title: "Research complete",
        description: `Found ${mockResults.companies.length} companies matching your criteria`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete research",
        variant: "destructive",
      });
    } finally {
      onProcessingChange(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">
          Research & Outbound Workflow
        </h2>
        <p className="text-xs text-grey-500 mt-0.5">
          Expand each step to research and connect with companies
        </p>
      </div>

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
          {/* Step 1: Define Investment Thesis */}
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
                  <Target className={`h-5 w-5 ${
                    activeStep === 1 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 1 ? "text-primary" : "text-foreground"
                  }`}>
                    Define Investment Thesis
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Specify criteria and focus areas
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs">Investment Thesis *</Label>
                  <Textarea
                    value={thesis}
                    onChange={(e) => setThesis(e.target.value)}
                    placeholder="Describe your investment criteria, target markets, and what makes a company a good fit..."
                    rows={5}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Sectors/Keywords *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSector}
                      onChange={(e) => setNewSector(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
                      placeholder="Add sector or keyword"
                      className="text-sm"
                    />
                    <Button onClick={addSector} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((sector) => (
                      <Badge key={sector} variant="secondary" className="flex items-center gap-1">
                        {sector}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeSector(sector)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 2: Configure Search Parameters */}
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
                    Configure Search Parameters
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Set filters and search scope
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-seed">Pre-seed</SelectItem>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="series-a">Series A</SelectItem>
                        <SelectItem value="series-b">Series B+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Funding Range</Label>
                    <Select value={fundingRange} onValueChange={setFundingRange}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1m">$0-1M</SelectItem>
                        <SelectItem value="1m-10m">$1M-10M</SelectItem>
                        <SelectItem value="10m-50m">$10M-50M</SelectItem>
                        <SelectItem value="50m+">$50M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Employee Count</Label>
                    <Select value={employeeCount} onValueChange={setEmployeeCount}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="10-50">10-50</SelectItem>
                        <SelectItem value="50-200">50-200</SelectItem>
                        <SelectItem value="200+">200+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 3: AI Company Research */}
          <AccordionItem value="step-3" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-start gap-3 w-full">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    activeStep === 3 ? "bg-primary text-white" : "bg-grey-100 text-grey-600"
                  }`}>
                    3
                  </div>
                </div>

                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  activeStep === 3 ? "bg-primary/10" : "bg-grey-100"
                }`}>
                  <Search className={`h-5 w-5 ${
                    activeStep === 3 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 3 ? "text-primary" : "text-foreground"
                  }`}>
                    AI Company Research
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Run search and rank companies
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="border border-border bg-card p-4 rounded-lg space-y-2">
                  <div className="text-xs text-grey-600">
                    <p><strong>Thesis:</strong> {thesis || "Not defined"}</p>
                    <p><strong>Sectors:</strong> {sectors.join(", ") || "None"}</p>
                    <p><strong>Filters:</strong> {location} • {stage} • {fundingRange} • {employeeCount} employees</p>
                  </div>
                </div>

                <Button
                  onClick={handleRunResearch}
                  disabled={!thesis || sectors.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-grey-800"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Run Research & Find Companies
                </Button>

                {(!thesis || sectors.length === 0) && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded">
                    ⚠️ Complete Steps 1 and 2 before running research
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-grey-400" />
          </div>

          {/* Step 4: Draft Outreach */}
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
                  <Mail className={`h-5 w-5 ${
                    activeStep === 4 ? "text-primary" : "text-grey-600"
                  }`} />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <h3 className={`text-sm font-semibold mb-1 ${
                    activeStep === 4 ? "text-primary" : "text-foreground"
                  }`}>
                    Draft Outreach
                  </h3>
                  <p className="text-xs text-grey-500 leading-relaxed">
                    Generate personalized emails
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <p className="text-xs text-grey-500">
                  Select companies from Step 3 to generate personalized outreach emails
                </p>
                <div className="text-xs text-grey-400 bg-grey-50 p-3 rounded border border-grey-200">
                  💡 This step becomes available after running company research in Step 3
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
