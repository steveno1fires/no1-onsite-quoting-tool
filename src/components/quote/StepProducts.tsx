import { Products, JobType } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FIRE_OPTIONS,
  HEARTH_OPTIONS,
  CHAMBER_OPTIONS,
  BEAM_OPTIONS,
  SURROUND_OPTIONS,
} from "@/data/productCatalog";

interface Props {
  data: Products;
  jobType: JobType | "";
  onChange: (data: Products) => void;
}

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">£</span>
      <Input
        type="number"
        min={0}
        step={0.01}
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="pl-7"
        placeholder="0.00"
      />
    </div>
  );
}

function OptionalSection({
  title,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{title}</Label>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && <div className="space-y-3 pt-1">{children}</div>}
    </div>
  );
}

export function StepProducts({ data, jobType, onChange }: Props) {
  const showKw = jobType?.startsWith("Woodburner") || jobType?.startsWith("Gas");

  const selectedFireLabel = data.fire.brand && data.fire.model
    ? `${data.fire.brand} ${data.fire.model}`
    : "";

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Fire/Appliance */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Fire / Appliance *</Label>
        <div>
          <Label className="text-xs">Select Fire</Label>
          <Select
            value={selectedFireLabel}
            onValueChange={(val) => {
              const item = FIRE_OPTIONS.find((f) => `${f.brand} ${f.model}` === val);
              if (item) {
                onChange({
                  ...data,
                  fire: { brand: item.brand, model: item.model, kw: item.kw || "", price: item.price },
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a fire/appliance" />
            </SelectTrigger>
            <SelectContent>
              {FIRE_OPTIONS.map((f) => (
                <SelectItem key={f.label} value={`${f.brand} ${f.model}`}>
                  {f.label} — £{f.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showKw && data.fire.kw && (
          <p className="text-xs text-muted-foreground">kW Output: {data.fire.kw}</p>
        )}
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
        </div>
      </div>

      {/* Hearth */}
      <OptionalSection title="Hearth" enabled={data.hearth.enabled} onToggle={(v) => onChange({ ...data, hearth: { ...data.hearth, enabled: v } })}>
        <div>
          <Label className="text-xs">Select Hearth</Label>
          <Select
            value={data.hearth.description}
            onValueChange={(val) => {
              const item = HEARTH_OPTIONS.find((h) => h.label === val);
              if (item) {
                onChange({ ...data, hearth: { ...data.hearth, description: item.label, price: item.price } });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a hearth" />
            </SelectTrigger>
            <SelectContent>
              {HEARTH_OPTIONS.map((h) => (
                <SelectItem key={h.label} value={h.label}>
                  {h.label} — £{h.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.hearth.price} onChange={(v) => onChange({ ...data, hearth: { ...data.hearth, price: v } })} />
        </div>
      </OptionalSection>

      {/* Chamber */}
      <OptionalSection title="Chamber" enabled={data.chamber.enabled} onToggle={(v) => onChange({ ...data, chamber: { ...data.chamber, enabled: v } })}>
        <div>
          <Label className="text-xs">Select Chamber</Label>
          <Select
            value={data.chamber.description}
            onValueChange={(val) => {
              const item = CHAMBER_OPTIONS.find((c) => c.label === val);
              if (item) {
                onChange({ ...data, chamber: { ...data.chamber, description: item.label, size: item.size, price: item.price } });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a chamber" />
            </SelectTrigger>
            <SelectContent>
              {CHAMBER_OPTIONS.map((c) => (
                <SelectItem key={c.label} value={c.label}>
                  {c.label} — £{c.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.chamber.price} onChange={(v) => onChange({ ...data, chamber: { ...data.chamber, price: v } })} />
        </div>
      </OptionalSection>

      {/* Beam */}
      <OptionalSection title="Beam" enabled={data.beam.enabled} onToggle={(v) => onChange({ ...data, beam: { ...data.beam, enabled: v }, surround: { ...data.surround, enabled: v ? false : data.surround.enabled } })}>
        <div>
          <Label className="text-xs">Select Beam</Label>
          <Select
            value={data.beam.material ? BEAM_OPTIONS.find((b) => b.material === data.beam.material)?.label || "" : ""}
            onValueChange={(val) => {
              const item = BEAM_OPTIONS.find((b) => b.label === val);
              if (item) {
                onChange({ ...data, beam: { ...data.beam, description: item.label, material: item.material, price: item.price } });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a beam" />
            </SelectTrigger>
            <SelectContent>
              {BEAM_OPTIONS.map((b) => (
                <SelectItem key={b.label} value={b.label}>
                  {b.label} — £{b.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.beam.price} onChange={(v) => onChange({ ...data, beam: { ...data.beam, price: v } })} />
        </div>
      </OptionalSection>

      {/* Surround */}
      <OptionalSection title="Surround" enabled={data.surround.enabled} onToggle={(v) => onChange({ ...data, surround: { ...data.surround, enabled: v } })}>
        <div>
          <Label className="text-xs">Select Surround</Label>
          <Select
            value={data.surround.description}
            onValueChange={(val) => {
              const item = SURROUND_OPTIONS.find((s) => s.label === val);
              if (item) {
                onChange({ ...data, surround: { ...data.surround, description: item.label, price: item.price } });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a surround" />
            </SelectTrigger>
            <SelectContent>
              {SURROUND_OPTIONS.map((s) => (
                <SelectItem key={s.label} value={s.label}>
                  {s.label} — £{s.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.surround.price} onChange={(v) => onChange({ ...data, surround: { ...data.surround, price: v } })} />
        </div>
      </OptionalSection>
    </div>
  );
}
