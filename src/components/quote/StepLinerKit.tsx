import { LinerKit } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  data: LinerKit;
  onChange: (data: LinerKit) => void;
}

const KIT_PRICES: Record<string, number> = {
  "Bungalow (6m)": 350,
  "House (12m)": 450,
};

export function StepLinerKit({ data, onChange }: Props) {
  const handleKitType = (v: string) => {
    const kitType = v as LinerKit["kitType"];
    const price = KIT_PRICES[kitType] ?? data.price;
    onChange({ ...data, kitType, price });
  };

  const toggleAccessory = (index: number, enabled: boolean) => {
    const accessories = [...data.accessories];
    accessories[index] = { ...accessories[index], enabled };
    onChange({ ...data, accessories });
  };

  return (
    <div className="animate-slide-in space-y-4">
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
        <Label className="text-sm font-semibold">Liner Kit Details</Label>

        <div>
          <Label className="text-xs">Kit Type</Label>
          <Select value={data.kitType} onValueChange={handleKitType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Bungalow (6m)">Bungalow (6m) — £350</SelectItem>
              <SelectItem value="House (12m)">House (12m) — £450</SelectItem>
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
              <SelectItem value="Mi Flues">Mi Flues</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Grade</Label>
          <Select value={data.grade} onValueChange={(v) => onChange({ ...data, grade: v as LinerKit["grade"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="316L">316L</SelectItem>
              <SelectItem value="904L">904L</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.kitType === "Custom" && (
          <div>
            <Label className="text-xs">Kit Price</Label>
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
        )}
      </div>

      {/* Reg Plate */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">
          Reg Plate — £{data.regPlateSize.trim() ? "40" : "0"}
        </Label>
        <div>
          <Label className="text-xs">Size</Label>
          <Input
            value={data.regPlateSize}
            onChange={(e) => {
              const regPlateSize = e.target.value;
              const regPlatePrice = regPlateSize.trim() ? 40 : 0;
              onChange({ ...data, regPlateSize, regPlatePrice });
            }}
            placeholder="e.g. 12x12"
          />
        </div>
      </div>

      {/* Accessories */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Accessories — £50 each</Label>
        {data.accessories.map((acc, i) => (
          <div key={acc.label} className="flex items-center gap-3">
            <Checkbox
              checked={acc.enabled}
              onCheckedChange={(v) => toggleAccessory(i, !!v)}
              id={`acc-${i}`}
            />
            <label htmlFor={`acc-${i}`} className="text-sm cursor-pointer">
              {acc.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
