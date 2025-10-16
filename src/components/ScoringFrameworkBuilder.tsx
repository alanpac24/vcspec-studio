import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export interface ScoringCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  prompt: string;
}

interface ScoringFrameworkBuilderProps {
  criteria: ScoringCriterion[];
  onChange: (criteria: ScoringCriterion[]) => void;
}

const defaultCriteria: ScoringCriterion[] = [
  {
    id: "1",
    name: "Team Quality",
    description: "Founder experience, domain expertise, track record",
    weight: 25,
    prompt: "Evaluate the founding team's experience, relevant domain expertise, and past track record. Consider education, previous roles, and accomplishments.",
  },
  {
    id: "2",
    name: "Market Opportunity",
    description: "Market size, growth potential, addressable market",
    weight: 25,
    prompt: "Assess the total addressable market (TAM), market growth rate, and the startup's ability to capture meaningful market share.",
  },
  {
    id: "3",
    name: "Traction & Metrics",
    description: "Revenue, growth rate, user engagement, key metrics",
    weight: 30,
    prompt: "Analyze current traction including revenue, growth rate, user metrics, retention, and other key performance indicators.",
  },
  {
    id: "4",
    name: "Product & Innovation",
    description: "Technical moat, IP, competitive advantages",
    weight: 20,
    prompt: "Evaluate the product's uniqueness, technical innovation, intellectual property, and sustainable competitive advantages.",
  },
];

export const ScoringFrameworkBuilder = ({
  criteria,
  onChange,
}: ScoringFrameworkBuilderProps) => {
  const [localCriteria, setLocalCriteria] = useState<ScoringCriterion[]>(
    criteria.length > 0 ? criteria : defaultCriteria
  );

  const handleAddCriterion = () => {
    const newCriterion: ScoringCriterion = {
      id: Date.now().toString(),
      name: "New Criterion",
      description: "Description of what to evaluate",
      weight: 10,
      prompt: "Detailed evaluation instructions for this criterion...",
    };
    const updated = [...localCriteria, newCriterion];
    setLocalCriteria(updated);
    onChange(updated);
  };

  const handleRemoveCriterion = (id: string) => {
    const updated = localCriteria.filter((c) => c.id !== id);
    // Redistribute weights proportionally
    const totalWeight = updated.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight > 0) {
      const normalizedCriteria = updated.map((c) => ({
        ...c,
        weight: Math.round((c.weight / totalWeight) * 100),
      }));
      setLocalCriteria(normalizedCriteria);
      onChange(normalizedCriteria);
    } else {
      setLocalCriteria(updated);
      onChange(updated);
    }
  };

  const handleUpdateCriterion = (
    id: string,
    field: keyof ScoringCriterion,
    value: any
  ) => {
    const updated = localCriteria.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setLocalCriteria(updated);
    onChange(updated);
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    const updated = localCriteria.map((c) =>
      c.id === id ? { ...c, weight: newWeight } : c
    );

    // Normalize weights to sum to 100
    const totalWeight = updated.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight !== 100) {
      const normalized = updated.map((c) => ({
        ...c,
        weight: Math.round((c.weight / totalWeight) * 100),
      }));
      setLocalCriteria(normalized);
      onChange(normalized);
    } else {
      setLocalCriteria(updated);
      onChange(updated);
    }
  };

  const totalWeight = localCriteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Scoring Criteria
          </h3>
          <p className="text-xs text-grey-500 mt-0.5">
            Define how deals should be evaluated and scored
          </p>
        </div>
        <div className="text-xs font-medium text-grey-600">
          Total: {totalWeight}%
        </div>
      </div>

      <div className="space-y-3">
        {localCriteria.map((criterion, index) => (
          <div
            key={criterion.id}
            className="border border-border bg-card p-4 rounded-lg space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="pt-2 cursor-move text-grey-400">
                <GripVertical className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Input
                      value={criterion.name}
                      onChange={(e) =>
                        handleUpdateCriterion(criterion.id, "name", e.target.value)
                      }
                      className="font-medium text-sm"
                      placeholder="Criterion name"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCriterion(criterion.id)}
                    className="text-grey-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Input
                  value={criterion.description}
                  onChange={(e) =>
                    handleUpdateCriterion(
                      criterion.id,
                      "description",
                      e.target.value
                    )
                  }
                  className="text-xs"
                  placeholder="Brief description"
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Weight: {criterion.weight}%</Label>
                  </div>
                  <Slider
                    value={[criterion.weight]}
                    onValueChange={([value]) =>
                      handleWeightChange(criterion.id, value)
                    }
                    max={100}
                    step={5}
                    className="py-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Evaluation Prompt</Label>
                  <Textarea
                    value={criterion.prompt}
                    onChange={(e) =>
                      handleUpdateCriterion(criterion.id, "prompt", e.target.value)
                    }
                    placeholder="Detailed instructions for AI evaluation..."
                    rows={3}
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddCriterion}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Criterion
      </Button>

      {totalWeight !== 100 && (
        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded">
          ⚠️ Weights should total 100% (currently {totalWeight}%)
        </div>
      )}
    </div>
  );
};
