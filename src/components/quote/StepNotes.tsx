import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function StepNotes({ value, onChange }: Props) {
  return (
    <div className="animate-slide-in">
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Additional Notes</Label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Any additional notes about the installation, access requirements, or customer preferences..."
          className="min-h-[200px] resize-none"
        />
      </div>
    </div>
  );
}
