import { useState } from "react";
import { Calendar, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScheduleConfigProps {
  workflowId: string;
  initialScheduleEnabled: boolean;
  initialScheduleCron: string | null;
}

const SCHEDULE_PRESETS = [
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at 9am", cron: "0 9 * * *" },
  { label: "Every Monday at 9am", cron: "0 9 * * 1" },
  { label: "Every weekday at 9am", cron: "0 9 * * 1-5" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
];

export const ScheduleConfig = ({
  workflowId,
  initialScheduleEnabled,
  initialScheduleCron,
}: ScheduleConfigProps) => {
  const [scheduleEnabled, setScheduleEnabled] = useState(initialScheduleEnabled);
  const [scheduleCron, setScheduleCron] = useState(initialScheduleCron || "0 9 * * *");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('workflows')
        .update({
          schedule_enabled: scheduleEnabled,
          schedule_cron: scheduleEnabled ? scheduleCron : null,
        })
        .eq('id', workflowId);

      if (error) throw error;

      // Set up cron job if enabled
      if (scheduleEnabled) {
        const { error: cronError } = await supabase.functions.invoke('setup-workflow-schedule', {
          body: {
            workflow_id: workflowId,
            cron_expression: scheduleCron,
          },
        });

        if (cronError) {
          console.error('Error setting up cron:', cronError);
          throw new Error('Failed to set up schedule');
        }
      }

      toast({
        title: scheduleEnabled ? "Schedule Enabled" : "Schedule Disabled",
        description: scheduleEnabled
          ? `Workflow will run: ${scheduleCron}`
          : "Workflow schedule has been disabled",
      });
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save schedule",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-grey-500" />
          <div>
            <h3 className="font-semibold text-sm">Schedule Automation</h3>
            <p className="text-xs text-grey-500">Run this workflow automatically</p>
          </div>
        </div>
        <Switch
          checked={scheduleEnabled}
          onCheckedChange={setScheduleEnabled}
        />
      </div>

      {scheduleEnabled && (
        <>
          <div className="space-y-3">
            <Label className="text-sm">Schedule Pattern (Cron Expression)</Label>
            <Input
              value={scheduleCron}
              onChange={(e) => setScheduleCron(e.target.value)}
              placeholder="0 9 * * *"
              className="font-mono text-sm"
            />
            <p className="text-xs text-grey-500">
              Current: {scheduleCron}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {SCHEDULE_PRESETS.map((preset) => (
                <button
                  key={preset.cron}
                  onClick={() => setScheduleCron(preset.cron)}
                  className="px-3 py-1.5 text-xs border border-border bg-background hover:bg-grey-50 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-grey-50 border border-border text-xs text-grey-700 space-y-1">
            <p className="font-semibold">Cron Format: minute hour day month weekday</p>
            <p>* = any value</p>
            <p>*/15 = every 15 units</p>
            <p>1-5 = range (Mon-Fri for weekday)</p>
          </div>
        </>
      )}

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save Schedule"}
      </Button>
    </div>
  );
};
