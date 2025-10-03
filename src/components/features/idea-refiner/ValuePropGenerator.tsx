import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Target,
  Award,
  MessageSquare
} from 'lucide-react';
import { ValueProposition, Positioning } from '@/types/idea-refiner';

interface ValuePropGeneratorProps {
  valueProposition?: ValueProposition;
  positioning?: Positioning;
  onUpdate: (vp: ValueProposition, pos: Positioning) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ValuePropGenerator = ({ 
  valueProposition, 
  positioning, 
  onUpdate, 
  onNext, 
  onBack 
}: ValuePropGeneratorProps) => {
  if (!valueProposition || !positioning) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Value Proposition & Positioning</h2>
        <p className="text-muted-foreground">
          Your refined value proposition and market positioning.
        </p>
      </div>

      <Tabs defaultValue="value-prop" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="value-prop">
            <Sparkles className="h-4 w-4 mr-2" />
            Value Proposition
          </TabsTrigger>
          <TabsTrigger value="positioning">
            <Target className="h-4 w-4 mr-2" />
            Positioning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="value-prop" className="space-y-4 mt-4">
          {/* Hero Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-2">{valueProposition.headline}</h3>
              <p className="text-lg text-muted-foreground">{valueProposition.subheadline}</p>
            </CardContent>
          </Card>

          {/* Key Benefits */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Key Benefits</h4>
            <div className="grid gap-3 md:grid-cols-3">
              {valueProposition.benefits.map((benefit) => (
                <Card key={benefit.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Differentiators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What Makes You Different</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {valueProposition.differentiators.map((diff, index) => (
                  <div key={index} className="flex items-start">
                    <Badge variant="secondary" className="mr-2 mt-0.5">{index + 1}</Badge>
                    <p className="text-sm">{diff}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proof Points */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Proof Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {valueProposition.proofPoints.map((proof, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{proof}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positioning" className="space-y-4 mt-4">
          {/* Positioning Statement */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Positioning Statement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">{positioning.statement}</p>
            </CardContent>
          </Card>

          {/* Positioning Elements */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Target Market</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{positioning.targetMarket}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{positioning.category}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Key Benefit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{positioning.keyBenefit}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Competitive Differentiation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{positioning.competitiveDifferentiation}</p>
              </CardContent>
            </Card>
          </div>

          {/* Reason to Believe */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reason to Believe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{positioning.reasonToBelieve}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};