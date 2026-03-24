import { Extra } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  data: Extra[];
  onChange: (data: Extra[]) => void;
}

export function StepExtras({ data, onChange }: Props) {
  const toggle = (index: number, enabled: boolean) => {
    const updated = [...data];
    updated[index] = { ...updated[index], enabled };
    onChange(updated);
  };

  const setPrice = (index: number, price: number) => {
    const updated = [...data];
    updated[index] = { ...updated[index], price };
    onChange(updated);
  };

  return (
    <div className="animate-slide-in">
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Select Extras</Label>
        {data.map((extra, i) => (
          <div key={extra.label} className="flex items-center gap-3">
            <Checkbox
              checked={extra.enabled}
              onCheckedChange={(v) => toggle(i, !!v)}
              id={`extra-${i}`}
            />
            <label htmlFor={`extra-${i}`} className="text-sm flex-1 cursor-pointer">
              {extra.label}
            </label>
            {extra.enabled && (
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={extra.price || ""}
                  onChange={(e) => setPrice(i, parseFloat(e.target.value) || 0)}
                  className="pl-5 h-8 text-sm"
                  placeholder="0.00"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
