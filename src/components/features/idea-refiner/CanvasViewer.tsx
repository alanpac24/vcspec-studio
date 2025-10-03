import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, Grid3X3 } from 'lucide-react';
import { LeanCanvas, BusinessModelCanvas } from '@/types/idea-refiner';

interface CanvasViewerProps {
  leanCanvas: LeanCanvas;
  businessModelCanvas?: BusinessModelCanvas;
}

const LeanCanvasGrid = ({ canvas }: { canvas: LeanCanvas }) => {
  const sections = [
    { 
      title: 'Problem', 
      items: canvas.problem, 
      gridArea: 'problem',
      color: 'bg-red-50 border-red-200' 
    },
    { 
      title: 'Solution', 
      items: canvas.solution, 
      gridArea: 'solution',
      color: 'bg-blue-50 border-blue-200' 
    },
    { 
      title: 'Key Metrics', 
      items: canvas.keyMetrics, 
      gridArea: 'metrics',
      color: 'bg-purple-50 border-purple-200' 
    },
    { 
      title: 'Unique Value Proposition', 
      items: [canvas.uniqueValueProposition], 
      gridArea: 'uvp',
      color: 'bg-green-50 border-green-200',
      isLarge: true 
    },
    { 
      title: 'Unfair Advantage', 
      items: [canvas.unfairAdvantage], 
      gridArea: 'advantage',
      color: 'bg-yellow-50 border-yellow-200' 
    },
    { 
      title: 'Channels', 
      items: canvas.channels, 
      gridArea: 'channels',
      color: 'bg-indigo-50 border-indigo-200' 
    },
    { 
      title: 'Customer Segments', 
      items: canvas.customerSegments, 
      gridArea: 'segments',
      color: 'bg-pink-50 border-pink-200' 
    },
    { 
      title: 'Cost Structure', 
      items: canvas.costStructure, 
      gridArea: 'costs',
      color: 'bg-orange-50 border-orange-200' 
    },
    { 
      title: 'Revenue Streams', 
      items: canvas.revenueStreams, 
      gridArea: 'revenue',
      color: 'bg-teal-50 border-teal-200' 
    }
  ];

  return (
    <div 
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(2, minmax(200px, 1fr))',
        gridTemplateAreas: `
          "problem solution metrics uvp segments"
          "problem solution advantage channels segments"
          "costs costs revenue revenue revenue"
        `
      }}
    >
      {sections.map((section) => (
        <Card
          key={section.title}
          className={`${section.color} border-2`}
          style={{ gridArea: section.gridArea }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {section.isLarge ? (
              <p className="text-sm">{section.items[0]}</p>
            ) : (
              <ul className="space-y-1">
                {section.items.map((item, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-muted-foreground mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const BusinessCanvasGrid = ({ canvas }: { canvas: BusinessModelCanvas }) => {
  const sections = [
    { 
      title: 'Key Partners', 
      items: canvas.keyPartners, 
      gridArea: 'partners',
      color: 'bg-blue-50 border-blue-200' 
    },
    { 
      title: 'Key Activities', 
      items: canvas.keyActivities, 
      gridArea: 'activities',
      color: 'bg-purple-50 border-purple-200' 
    },
    { 
      title: 'Key Resources', 
      items: canvas.keyResources, 
      gridArea: 'resources',
      color: 'bg-indigo-50 border-indigo-200' 
    },
    { 
      title: 'Value Propositions', 
      items: canvas.valuePropositions, 
      gridArea: 'value',
      color: 'bg-green-50 border-green-200' 
    },
    { 
      title: 'Customer Relationships', 
      items: canvas.customerRelationships, 
      gridArea: 'relationships',
      color: 'bg-yellow-50 border-yellow-200' 
    },
    { 
      title: 'Channels', 
      items: canvas.channels, 
      gridArea: 'channels',
      color: 'bg-orange-50 border-orange-200' 
    },
    { 
      title: 'Customer Segments', 
      items: canvas.customerSegments, 
      gridArea: 'segments',
      color: 'bg-pink-50 border-pink-200' 
    },
    { 
      title: 'Cost Structure', 
      items: canvas.costStructure, 
      gridArea: 'costs',
      color: 'bg-red-50 border-red-200' 
    },
    { 
      title: 'Revenue Streams', 
      items: canvas.revenueStreams, 
      gridArea: 'revenue',
      color: 'bg-teal-50 border-teal-200' 
    }
  ];

  return (
    <div 
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(3, minmax(150px, 1fr))',
        gridTemplateAreas: `
          "partners partners activities activities value value relationships relationships segments segments"
          "partners partners resources resources value value channels channels segments segments"
          "costs costs costs costs costs revenue revenue revenue revenue revenue"
        `
      }}
    >
      {sections.map((section) => (
        <Card
          key={section.title}
          className={`${section.color} border-2`}
          style={{ gridArea: section.gridArea }}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {section.items.map((item, index) => (
                <li key={index} className="text-xs flex items-start">
                  <span className="text-muted-foreground mr-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const CanvasViewer = ({ leanCanvas, businessModelCanvas }: CanvasViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Business Canvas</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      <Tabs defaultValue="lean" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lean">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Lean Canvas
          </TabsTrigger>
          {businessModelCanvas && (
            <TabsTrigger value="business">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Business Model Canvas
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="lean" className="mt-4">
          <div className={isFullscreen ? 'fixed inset-0 bg-background z-50 p-8 overflow-auto' : ''}>
            <LeanCanvasGrid canvas={leanCanvas} />
          </div>
        </TabsContent>

        {businessModelCanvas && (
          <TabsContent value="business" className="mt-4">
            <div className={isFullscreen ? 'fixed inset-0 bg-background z-50 p-8 overflow-auto' : ''}>
              <BusinessCanvasGrid canvas={businessModelCanvas} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};