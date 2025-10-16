import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Users, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export interface DealScore {
  companyName: string;
  overallScore: number;
  recommendation: "pass" | "review" | "reject";
  criteria: {
    name: string;
    score: number;
    weight: number;
    reasoning: string;
  }[];
  keyHighlights: string[];
  redFlags: string[];
  summary: string;
}

interface DealScoreCardProps {
  score: DealScore | null;
  isLoading?: boolean;
}

const getRecommendationConfig = (recommendation: DealScore["recommendation"]) => {
  switch (recommendation) {
    case "pass":
      return {
        label: "Strong Pass",
        icon: CheckCircle2,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    case "review":
      return {
        label: "Needs Review",
        icon: AlertCircle,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    case "reject":
      return {
        label: "Pass",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
  }
};

const getCriterionIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("team")) return Users;
  if (lowerName.includes("market")) return Target;
  if (lowerName.includes("traction")) return TrendingUp;
  if (lowerName.includes("product")) return Zap;
  return Target;
};

export const DealScoreCard = ({ score, isLoading }: DealScoreCardProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-grey-100 rounded-lg"></div>
        <div className="h-64 bg-grey-100 rounded-lg"></div>
        <div className="h-48 bg-grey-100 rounded-lg"></div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="border-2 border-dashed border-grey-300 rounded-lg p-12 text-center">
        <div className="text-grey-400 mb-3">
          <Target className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-2">
          No Assessment Yet
        </h3>
        <p className="text-xs text-grey-500">
          Upload a pitch deck and configure your scoring framework to see results
        </p>
      </div>
    );
  }

  const recommendationConfig = getRecommendationConfig(score.recommendation);
  const RecommendationIcon = recommendationConfig.icon;

  return (
    <div className="space-y-4">
      {/* Overall Score Card */}
      <div className={`border ${recommendationConfig.borderColor} ${recommendationConfig.bgColor} rounded-lg p-6`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {score.companyName}
            </h3>
            <div className="flex items-center gap-2">
              <RecommendationIcon className={`h-5 w-5 ${recommendationConfig.color}`} />
              <span className={`text-sm font-semibold ${recommendationConfig.color}`}>
                {recommendationConfig.label}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">
              {score.overallScore}
            </div>
            <div className="text-xs text-grey-500">out of 100</div>
          </div>
        </div>

        <p className="text-sm text-grey-700 leading-relaxed">
          {score.summary}
        </p>
      </div>

      {/* Criteria Breakdown */}
      <div className="border border-border bg-card rounded-lg p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Score Breakdown</h4>
        <div className="space-y-3">
          {score.criteria.map((criterion, index) => {
            const Icon = getCriterionIcon(criterion.name);
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-grey-500" />
                    <span className="text-sm font-medium text-foreground">
                      {criterion.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {criterion.weight}%
                    </Badge>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {criterion.score}/100
                  </span>
                </div>
                <Progress value={criterion.score} className="h-2" />
                <p className="text-xs text-grey-600 leading-relaxed pl-6">
                  {criterion.reasoning}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Highlights */}
      {score.keyHighlights.length > 0 && (
        <div className="border border-border bg-card rounded-lg p-5 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Key Highlights</h4>
          <ul className="space-y-2">
            {score.keyHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-grey-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {score.redFlags.length > 0 && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-5 space-y-3">
          <h4 className="text-sm font-semibold text-red-900">Red Flags</h4>
          <ul className="space-y-2">
            {score.redFlags.map((flag, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-grey-800">
          Schedule Meeting
        </Button>
        <Button variant="outline" className="flex-1">
          Pass for Now
        </Button>
      </div>
    </div>
  );
};
