import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import IdeaRefiner from "./pages/IdeaRefiner";
import MarketResearch from "./pages/MarketResearch";
import OfferDesign from "./pages/OfferDesign";
import PricingStrategy from "./pages/PricingStrategy";
import GTMPlanner from "./pages/GTMPlanner";
import MessagingCopy from "./pages/MessagingCopy";
import Financials from "./pages/Financials";
import RiskCompliance from "./pages/RiskCompliance";
import InvestorOnePager from "./pages/InvestorOnePager";
import RunsPage from "./pages/RunsPage";
import AgentsLibrary from "./pages/AgentsLibrary";
import WorkflowDetail from "./pages/WorkflowDetail";
import Auth from "./pages/Auth";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/" element={<Index />} />
            <Route path="/idea-refiner" element={<IdeaRefiner />} />
            <Route path="/market-research" element={<MarketResearch />} />
            <Route path="/offer-design" element={<OfferDesign />} />
            <Route path="/pricing-strategy" element={<PricingStrategy />} />
            <Route path="/gtm-planner" element={<GTMPlanner />} />
            <Route path="/messaging-copy" element={<MessagingCopy />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/risk-compliance" element={<RiskCompliance />} />
            <Route path="/investor-one-pager" element={<InvestorOnePager />} />
            <Route path="/runs" element={<RunsPage />} />
            <Route path="/agents" element={<AgentsLibrary />} />
            <Route path="/workflow/:id" element={<WorkflowDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
