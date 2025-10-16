import { Target, Settings, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResearchOutboundPreviewProps {
  activeStep: number;
  currentResults: any | null;
  isProcessing: boolean;
}

const stepPreviews = {
  1: {
    icon: Target,
    title: "Define Investment Thesis",
    description: "Define your investment criteria, target markets, and what makes a company a good fit. Add sector keywords to focus the search.",
  },
  2: {
    icon: Settings,
    title: "Configure Search Parameters",
    description: "Set filters for location, funding stage, company size, and other criteria to narrow down the search results.",
  },
  3: {
    icon: Search,
    title: "AI Company Research",
    description: "The AI will search databases, news sources, and company information to find and rank companies matching your criteria.",
  },
  4: {
    icon: Mail,
    title: "Draft Outreach",
    description: "Select companies from the results and the AI will generate personalized outreach emails based on company insights.",
  },
};

export const ResearchOutboundPreview = ({ activeStep, currentResults, isProcessing }: ResearchOutboundPreviewProps) => {
  const stepConfig = stepPreviews[activeStep as keyof typeof stepPreviews];
  const StepIcon = stepConfig.icon;

  if (activeStep === 3 && (currentResults || isProcessing)) {
    return (
      <div className="h-full flex flex-col bg-grey-50">
        <div className="bg-background border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Research Results</h2>
          <p className="text-xs text-grey-500 mt-0.5">
            {currentResults ? `Found ${currentResults.companies.length} companies` : "Searching..."}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-grey-600">Researching companies...</p>
              </div>
            </div>
          ) : currentResults ? (
            <div className="space-y-4">
              {currentResults.companies.map((company: any) => (
                <div key={company.id} className="border border-border bg-background p-4 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground">{company.name}</h3>
                        <Badge variant="outline" className="text-xs">{company.stage}</Badge>
                      </div>
                      <p className="text-sm text-grey-600">{company.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{company.score}</div>
                        <div className="text-xs text-grey-500">Fit Score</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="bg-grey-50 p-2 rounded">
                      <div className="text-xs text-grey-500">Location</div>
                      <div className="text-sm font-medium">{company.location}</div>
                    </div>
                    <div className="bg-grey-50 p-2 rounded">
                      <div className="text-xs text-grey-500">Funding</div>
                      <div className="text-sm font-medium">{company.funding}</div>
                    </div>
                    <div className="bg-grey-50 p-2 rounded">
                      <div className="text-xs text-grey-500">Team Size</div>
                      <div className="text-sm font-medium">{company.employees}</div>
                    </div>
                    <div className="bg-grey-50 p-2 rounded">
                      <div className="text-xs text-grey-500">Founded</div>
                      <div className="text-sm font-medium">{company.founded}</div>
                    </div>
                  </div>

                  <div className="bg-primary/5 border-l-2 border-primary p-3 rounded-r mb-3">
                    <div className="text-xs font-semibold text-foreground mb-1">Why it's a fit</div>
                    <p className="text-xs text-grey-700">{company.fitReason}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                      {company.website}
                    </a>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      Draft Email
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-grey-50">
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
                <li>• Define your investment thesis and target profile</li>
                <li>• Add sector keywords to focus the AI search</li>
                <li>• The more specific your thesis, the better the results</li>
              </>
            )}
            {activeStep === 2 && (
              <>
                <li>• Set filters to narrow down the search scope</li>
                <li>• Combine multiple parameters for precise targeting</li>
                <li>• Filters help reduce noise and focus on relevant companies</li>
              </>
            )}
            {activeStep === 3 && (
              <>
                <li>• AI searches company databases and news sources</li>
                <li>• Each company is scored based on fit with your thesis</li>
                <li>• Results are ranked by relevance and opportunity</li>
              </>
            )}
            {activeStep === 4 && (
              <>
                <li>• Select companies to reach out to</li>
                <li>• AI generates personalized emails using company insights</li>
                <li>• Each email references specific company details and fit</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
