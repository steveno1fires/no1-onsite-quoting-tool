import { CustomerDetails } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  data: CustomerDetails;
  onChange: (data: CustomerDetails) => void;
}

export function StepCustomer({ data, onChange }: Props) {
  const update = (field: keyof CustomerDetails, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Job Number Section */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">SM8 Job Number</h3>
        <div>
          <Label htmlFor="jobNumber" className="text-xs font-medium">
            Job Number *
          </Label>
          <Input
            id="jobNumber"
            value={data.jobNumber}
            onChange={(e) => update("jobNumber", e.target.value)}
            placeholder="e.g. #1059"
          />
        </div>
      </div>
    </div>
  );
}
// Force rebuild Thu Mar 26 11:14:00 GMT 2026
