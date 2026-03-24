import { Products, JobType } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Fire/Appliance - required */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Fire / Appliance *</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Brand</Label>
            <Input value={data.fire.brand} onChange={(e) => onChange({ ...data, fire: { ...data.fire, brand: e.target.value } })} placeholder="Stovax" />
          </div>
          <div>
            <Label className="text-xs">Model</Label>
            <Input value={data.fire.model} onChange={(e) => onChange({ ...data, fire: { ...data.fire, model: e.target.value } })} placeholder="Vogue Midi" />
          </div>
        </div>
        {showKw && (
          <div>
            <Label className="text-xs">kW Output</Label>
            <Input value={data.fire.kw || ""} onChange={(e) => onChange({ ...data, fire: { ...data.fire, kw: e.target.value } })} placeholder="5" />
          </div>
        )}
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
        </div>
      </div>

      <OptionalSection title="Hearth" enabled={data.hearth.enabled} onToggle={(v) => onChange({ ...data, hearth: { ...data.hearth, enabled: v } })}>
        <div>
          <Label className="text-xs">Material</Label>
          <Input value={data.hearth.description} onChange={(e) => onChange({ ...data, hearth: { ...data.hearth, description: e.target.value } })} placeholder="Natural Slate" />
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.hearth.price} onChange={(v) => onChange({ ...data, hearth: { ...data.hearth, price: v } })} />
        </div>
      </OptionalSection>

      <OptionalSection title="Chamber" enabled={data.chamber.enabled} onToggle={(v) => onChange({ ...data, chamber: { ...data.chamber, enabled: v } })}>
        <div>
          <Label className="text-xs">Size</Label>
          <Input value={data.chamber.size} onChange={(e) => onChange({ ...data, chamber: { ...data.chamber, size: e.target.value } })} placeholder="36x36" />
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.chamber.price} onChange={(v) => onChange({ ...data, chamber: { ...data.chamber, price: v } })} />
        </div>
      </OptionalSection>

      <OptionalSection title="Beam" enabled={data.beam.enabled} onToggle={(v) => onChange({ ...data, beam: { ...data.beam, enabled: v } })}>
        <div>
          <Label className="text-xs">Material</Label>
          <Input value={data.beam.material} onChange={(e) => onChange({ ...data, beam: { ...data.beam, material: e.target.value } })} placeholder="Solid Oak" />
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.beam.price} onChange={(v) => onChange({ ...data, beam: { ...data.beam, price: v } })} />
        </div>
      </OptionalSection>

      <OptionalSection title="Surround" enabled={data.surround.enabled} onToggle={(v) => onChange({ ...data, surround: { ...data.surround, enabled: v } })}>
        <div>
          <Label className="text-xs">Description</Label>
          <Input value={data.surround.description} onChange={(e) => onChange({ ...data, surround: { ...data.surround, description: e.target.value } })} placeholder="Cast Iron" />
        </div>
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.surround.price} onChange={(v) => onChange({ ...data, surround: { ...data.surround, price: v } })} />
        </div>
      </OptionalSection>
    </div>
  );
}
