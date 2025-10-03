import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Info,
  Plus,
  Shield
} from 'lucide-react';
import { RiskAssumption } from '@/types/idea-refiner';

interface RiskAssumptionLoggerProps {
  items: RiskAssumption[];
  onUpdate: (items: RiskAssumption[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const RiskMatrix = ({ items }: { items: RiskAssumption[] }) => {
  const risks = items.filter(item => item.type === 'risk');
  
  const getPosition = (risk: RiskAssumption) => {
    const impactMap = { high: 2, medium: 1, low: 0 };
    const likelihoodMap = { high: 2, medium: 1, low: 0 };
    return {
      x: likelihoodMap[risk.likelihood],
      y: impactMap[risk.impact]
    };
  };

  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <div className="grid grid-cols-4 gap-2">
        <div></div>
        <div className="text-center text-sm font-medium">Low</div>
        <div className="text-center text-sm font-medium">Medium</div>
        <div className="text-center text-sm font-medium">High</div>
        
        <div className="text-sm font-medium flex items-center">High</div>
        <div className="h-24 bg-yellow-100 rounded border border-yellow-200"></div>
        <div className="h-24 bg-orange-100 rounded border border-orange-200"></div>
        <div className="h-24 bg-red-100 rounded border border-red-200 relative">
          {risks.filter(r => getPosition(r).x === 2 && getPosition(r).y === 2).map((risk, idx) => (
            <div key={risk.id} className="absolute p-1" style={{ top: `${idx * 20}px` }}>
              <Badge variant="destructive" className="text-xs">{risk.category}</Badge>
            </div>
          ))}
        </div>
        
        <div className="text-sm font-medium flex items-center">Medium</div>
        <div className="h-24 bg-green-100 rounded border border-green-200"></div>
        <div className="h-24 bg-yellow-100 rounded border border-yellow-200"></div>
        <div className="h-24 bg-orange-100 rounded border border-orange-200"></div>
        
        <div className="text-sm font-medium flex items-center">Low</div>
        <div className="h-24 bg-green-100 rounded border border-green-200"></div>
        <div className="h-24 bg-green-100 rounded border border-green-200"></div>
        <div className="h-24 bg-yellow-100 rounded border border-yellow-200"></div>
        
        <div></div>
        <div className="text-center text-sm font-medium mt-2" colSpan={3}>Likelihood →</div>
      </div>
      <div className="text-center text-sm font-medium mt-2 -ml-16 transform -rotate-90 origin-center">
        Impact →
      </div>
    </div>
  );
};

const RiskCard = ({ item }: { item: RiskAssumption }) => {
  const impactColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const statusColors = {
    unvalidated: 'bg-gray-100 text-gray-800',
    testing: 'bg-blue-100 text-blue-800',
    validated: 'bg-green-100 text-green-800',
    invalidated: 'bg-red-100 text-red-800'
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {item.type === 'risk' ? (
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            ) : (
              <Info className="h-4 w-4 text-blue-500" />
            )}
            <CardTitle className="text-base">{item.category}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge className={impactColors[item.impact]} variant="outline">
              {item.impact} impact
            </Badge>
            {item.type === 'risk' && (
              <Badge variant="outline">
                {item.likelihood} likelihood
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{item.description}</p>
        
        {item.mitigation && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {item.type === 'risk' ? 'Mitigation' : 'Validation Method'}
            </p>
            <p className="text-sm bg-muted/50 p-2 rounded">{item.mitigation}</p>
          </div>
        )}

        <Badge className={statusColors[item.status]} variant="outline">
          {item.status}
        </Badge>
      </CardContent>
    </Card>
  );
};

export const RiskAssumptionLogger = ({ items, onUpdate, onNext, onBack }: RiskAssumptionLoggerProps) => {
  const risks = items.filter(item => item.type === 'risk');
  const assumptions = items.filter(item => item.type === 'assumption');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Risks & Assumptions</h2>
        <p className="text-muted-foreground">
          Key risks to mitigate and assumptions to validate.
        </p>
      </div>

      <div className="flex gap-4">
        <Card className="flex-1">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{risks.length}</p>
            <p className="text-sm text-muted-foreground">Identified Risks</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="pt-6 text-center">
            <Info className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{assumptions.length}</p>
            <p className="text-sm text-muted-foreground">Key Assumptions</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="pt-6 text-center">
            <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">
              {items.filter(i => i.status === 'validated').length}
            </p>
            <p className="text-sm text-muted-foreground">Validated Items</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="risks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="risks">
            Risks ({risks.length})
          </TabsTrigger>
          <TabsTrigger value="assumptions">
            Assumptions ({assumptions.length})
          </TabsTrigger>
          <TabsTrigger value="matrix">
            Risk Matrix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Risk
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {risks.map((risk) => (
              <RiskCard key={risk.id} item={risk} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assumptions" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Assumption
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {assumptions.map((assumption) => (
              <RiskCard key={assumption.id} item={assumption} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="mt-4">
          <RiskMatrix items={items} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext}>
          Continue to Canvas
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};