import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Users, DollarSign } from "lucide-react";

interface DealAnalysisReportProps {
  report: any;
}

export const DealAnalysisReport = ({ report }: DealAnalysisReportProps) => {
  const getRecommendationColor = (rec: string) => {
    if (rec === "DEEP DIVE") return "bg-green-100 text-green-800 border-green-300";
    if (rec === "CONSIDER") return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getRecommendationIcon = (rec: string) => {
    if (rec === "DEEP DIVE") return <CheckCircle2 className="h-5 w-5" />;
    if (rec === "CONSIDER") return <AlertCircle className="h-5 w-5" />;
    return <XCircle className="h-5 w-5" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 7.5) return "text-green-600";
    if (score >= 5.5) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {report.company_name}
            </h2>
            <p className="text-sm text-grey-500">
              Analysis generated {new Date(report.generated_at).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(parseFloat(report.overall_score))}`}>
              {report.overall_score}
            </div>
            <p className="text-sm text-grey-500">Overall Score</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 p-4 rounded-lg border ${getRecommendationColor(report.recommendation)}`}>
          {getRecommendationIcon(report.recommendation)}
          <span className="font-semibold text-lg">{report.recommendation}</span>
        </div>
      </Card>

      {/* Company Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Company Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-grey-500">Stage</p>
            <p className="font-medium">{report.extracted_data?.stage || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-grey-500">Industry</p>
            <p className="font-medium">{report.extracted_data?.industry || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-grey-500">Funding Amount</p>
            <p className="font-medium">{report.extracted_data?.funding_amount || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-grey-500">Team Size</p>
            <p className="font-medium">{report.extracted_data?.team_size || "N/A"}</p>
          </div>
        </div>

        {report.extracted_data?.problem && (
          <div className="mt-4">
            <p className="text-sm text-grey-500 mb-1">Problem</p>
            <p className="text-sm">{report.extracted_data.problem}</p>
          </div>
        )}

        {report.extracted_data?.solution && (
          <div className="mt-4">
            <p className="text-sm text-grey-500 mb-1">Solution</p>
            <p className="text-sm">{report.extracted_data.solution}</p>
          </div>
        )}
      </Card>

      {/* Detailed Scores */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Market Analysis */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Market</h3>
          </div>
          <div className={`text-3xl font-bold mb-2 ${getScoreColor(report.summary.market?.market_score || 0)}`}>
            {report.summary.market?.market_score || "N/A"}
          </div>
          <div className="space-y-2 text-sm">
            {report.summary.market?.market_size_assessment && (
              <p className="text-grey-600">{report.summary.market.market_size_assessment}</p>
            )}
            {report.summary.market?.growth_potential && (
              <p><span className="text-grey-500">Growth:</span> {report.summary.market.growth_potential}</p>
            )}
          </div>
        </Card>

        {/* Team Evaluation */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Team</h3>
          </div>
          <div className={`text-3xl font-bold mb-2 ${getScoreColor(report.summary.team?.team_score || 0)}`}>
            {report.summary.team?.team_score || "N/A"}
          </div>
          <div className="space-y-2 text-sm">
            {report.summary.team?.founder_experience && (
              <p><span className="text-grey-500">Experience:</span> {report.summary.team.founder_experience}</p>
            )}
            {report.summary.team?.domain_expertise && (
              <p><span className="text-grey-500">Expertise:</span> {report.summary.team.domain_expertise}</p>
            )}
          </div>
        </Card>

        {/* Financial Analysis */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Financials</h3>
          </div>
          <div className={`text-3xl font-bold mb-2 ${getScoreColor(report.summary.financial?.financial_score || 0)}`}>
            {report.summary.financial?.financial_score || "N/A"}
          </div>
          <div className="space-y-2 text-sm">
            {report.summary.financial?.revenue_growth && (
              <p><span className="text-grey-500">Revenue Growth:</span> {report.summary.financial.revenue_growth}</p>
            )}
            {report.summary.financial?.runway_months && (
              <p><span className="text-grey-500">Runway:</span> {report.summary.financial.runway_months} months</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
