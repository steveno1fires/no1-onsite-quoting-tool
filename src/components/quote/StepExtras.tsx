import { Extra } from "@/types/extra";
import { EXTRAS_CONFIG } from "@/data/extrasConfig";
import { JobType } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// woodburnerOnly flag is now on EXTRAS_CONFIG items directly

interface Props {
  data: Extra[];
  jobType: JobType | "";
  onChange: (data: Extra[]) => void;
}

export function StepExtras({ data, jobType, onChange }: Props) {
  const isWoodburner = jobType === "Woodburner — Chimney Liner" || jobType === "Woodburner — Twin Wall";
  const toggle = (index: number, enabled: boolean) => {
    const updated = [...data];
    const config = EXTRAS_CONFIG[index];
    if (enabled && config) {
      // Disable mutually exclusive extra
      if (config.excludes) {
        const exIdx = EXTRAS_CONFIG.findIndex((c) => c.label === config.excludes);
        if (exIdx >= 0) {
          updated[exIdx] = { ...updated[exIdx], enabled: false, price: 0, selectedOption: undefined };
        }
      }
      if (config.type === "fixed") {
        updated[index] = { ...updated[index], enabled, price: config.price || 0 };
      } else if (config.type === "select" && config.options?.length) {
        const first = config.options[0];
        updated[index] = { ...updated[index], enabled, selectedOption: first.label, price: first.price };
      } else {
        updated[index] = { ...updated[index], enabled };
      }
    } else {
      updated[index] = { ...updated[index], enabled, price: 0, selectedOption: undefined };
    }
    onChange(updated);
  };

  const setOption = (index: number, optionLabel: string) => {
    const config = EXTRAS_CONFIG[index];
    const opt = config?.options?.find((o) => o.label === optionLabel);
    if (!opt) return;
    const updated = [...data];
    updated[index] = { ...updated[index], selectedOption: optionLabel, price: opt.price };
    onChange(updated);
  };

  const setPrice = (index: number, price: number) => {
    const updated = [...data];
    updated[index] = { ...updated[index], price };
    onChange(updated);
  };

  return (
    <div className="animate-slide-in">
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
        <Label className="text-sm font-semibold">Select Extras</Label>
        {data.map((extra, i) => {
          const config = EXTRAS_CONFIG[i];
          if (!config) return null;
          // Hide woodburner-only extras on non-woodburner jobs
          if (!isWoodburner && config.woodburnerOnly) return null;

          return (
            <div key={extra.label} className="space-y-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={extra.enabled}
                  onCheckedChange={(v) => toggle(i, !!v)}
                  id={`extra-${i}`}
                />
                <label htmlFor={`extra-${i}`} className="text-sm flex-1 cursor-pointer font-medium">
                  {extra.label}
                  {extra.enabled && config.type === "fixed" && (
                    <span className="text-muted-foreground font-normal ml-2">— £{config.price}</span>
                  )}
                </label>
              </div>

              {config.description && (
                <p className="text-xs text-muted-foreground ml-8">{config.description}</p>
              )}

              {extra.enabled && config.type === "select" && config.options && (
                <div className="ml-8 flex items-center gap-2">
                  <Select
                    value={extra.selectedOption || ""}
                    onValueChange={(val) => setOption(i, val)}
                  >
                    <SelectTrigger className="h-8 text-sm flex-1">
                      <SelectValue placeholder="Choose option" />
                    </SelectTrigger>
                    <SelectContent>
                      {config.options.map((opt) => (
                        <SelectItem key={opt.label} value={opt.label}>
                          {opt.label}{opt.price > 0 ? ` — £${opt.price}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {extra.selectedOption === "Bespoke" && (
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
              )}

              {extra.enabled && config.type === "info" && (
                <div className="ml-8 relative w-28">
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
          );
        })}
      </div>
    </div>
  );
}
