import { JobType, JOB_TYPES } from "@/types/quote";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  value: JobType | "";
  onChange: (value: JobType) => void;
}

export function StepJobType({ value, onChange }: Props) {
  return (
    <div className="animate-slide-in">
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Select Job Type *</Label>
        <Select value={value} onValueChange={(v) => onChange(v as JobType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a job type..." />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map((jt) => (
              <SelectItem key={jt} value={jt}>{jt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
