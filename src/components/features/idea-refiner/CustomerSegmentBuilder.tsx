import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Target, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  UserCircle
} from 'lucide-react';
import { CustomerSegment, IdealCustomerProfile } from '@/types/idea-refiner';

interface CustomerSegmentBuilderProps {
  segments: CustomerSegment[];
  idealProfiles: IdealCustomerProfile[];
  onUpdate: (segments: CustomerSegment[], profiles: IdealCustomerProfile[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const SegmentCard = ({ segment }: { segment: CustomerSegment }) => {
  const accessibilityColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-red-100 text-red-800'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{segment.name}</CardTitle>
            <CardDescription>{segment.description}</CardDescription>
          </div>
          <Badge className={accessibilityColors[segment.accessibility]}>
            {segment.accessibility} accessibility
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Demographics</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {segment.demographics.age && (
              <div><span className="text-muted-foreground">Age:</span> {segment.demographics.age}</div>
            )}
            {segment.demographics.location && (
              <div><span className="text-muted-foreground">Location:</span> {segment.demographics.location}</div>
            )}
            {segment.demographics.income && (
              <div><span className="text-muted-foreground">Income:</span> {segment.demographics.income}</div>
            )}
            {segment.demographics.occupation && (
              <div><span className="text-muted-foreground">Role:</span> {segment.demographics.occupation}</div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Psychographics</p>
          <div className="space-y-2">
            {segment.psychographics.painPoints && segment.psychographics.painPoints.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Pain Points:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {segment.psychographics.painPoints.map((pain, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pain}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {segment.psychographics.goals && segment.psychographics.goals.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Goals:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {segment.psychographics.goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm">
            <span className="text-muted-foreground">Market Size:</span>{' '}
            <span className="font-medium">{segment.size.toLocaleString()} potential customers</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileCard = ({ profile }: { profile: IdealCustomerProfile }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <UserCircle className="h-10 w-10 text-muted-foreground" />
          <div>
            <CardTitle className="text-lg">{profile.persona.name}</CardTitle>
            <CardDescription>{profile.persona.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Background</p>
          <p className="text-sm text-muted-foreground">{profile.persona.background}</p>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">A Day in Their Life</p>
          <p className="text-sm text-muted-foreground">{profile.persona.dayInLife}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Problems</p>
            <ul className="space-y-1">
              {profile.problems.map((problem, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Goals</p>
            <ul className="space-y-1">
              {profile.goals.map((goal, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2">•</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Common Objections</p>
          <div className="space-y-1">
            {profile.objections.map((objection, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                "{objection}"
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomerSegmentBuilder = ({ 
  segments, 
  idealProfiles, 
  onUpdate, 
  onNext, 
  onBack 
}: CustomerSegmentBuilderProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Customer Segments & Profiles</h2>
        <p className="text-muted-foreground">
          Review and refine your target customer segments and ideal customer profiles.
        </p>
      </div>

      <Tabs defaultValue="segments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="segments">
            <Users className="h-4 w-4 mr-2" />
            Customer Segments ({segments.length})
          </TabsTrigger>
          <TabsTrigger value="profiles">
            <Target className="h-4 w-4 mr-2" />
            Ideal Profiles ({idealProfiles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              These segments represent different groups within your target market
            </p>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Segment
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {segments.map((segment) => (
              <SegmentCard key={segment.id} segment={segment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Detailed personas representing your ideal customers
            </p>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Profile
            </Button>
          </div>

          <div className="grid gap-4">
            {idealProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {idealProfiles.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="text-center py-8">
                <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No ideal customer profiles created yet.
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Profile
                </Button>
              </CardContent>
            </Card>
          )}
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