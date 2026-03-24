import { LinerKit } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: LinerKit;
  onChange: (data: LinerKit) => void;
}

export function StepLinerKit({ data, onChange }: Props) {
  return (
    <div className="animate-slide-in">
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
        <Label className="text-sm font-semibold">Liner Kit Details</Label>

        <div>
          <Label className="text-xs">Kit Type</Label>
          <Select value={data.kitType} onValueChange={(v) => onChange({ ...data, kitType: v as LinerKit["kitType"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Bungalow (6m)">Bungalow (6m)</SelectItem>
              <SelectItem value="House (12m)">House (12m)</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Flue Size</Label>
          <Select value={data.flueSize} onValueChange={(v) => onChange({ ...data, flueSize: v as LinerKit["flueSize"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='5"'>5"</SelectItem>
              <SelectItem value='6"'>6"</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">System</Label>
          <Select value={data.system} onValueChange={(v) => onChange({ ...data, system: v as LinerKit["system"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Schiedel Techno Flex">Schiedel Techno Flex</SelectItem>
              <SelectItem value="Schiedel ICID">Schiedel ICID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">£</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={data.price || ""}
              onChange={(e) => onChange({ ...data, price: parseFloat(e.target.value) || 0 })}
              className="pl-7"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
