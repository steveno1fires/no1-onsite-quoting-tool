
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
  CAPITAL_HEARTHS,
} from "@/data/productCatalog";
import { CAPITAL_FIREPLACE_MATERIALS } from "@/data/capitalFireplaces";
import { CAPITAL_BEAM_CATEGORIES } from "@/data/capitalBeams";
import React from "react";

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
  const [hearthMaterial, setHearthMaterial] = React.useState("");
  const [hearthType, setHearthType] = React.useState("");
  const [fireplaceMaterial, setFireplaceMaterial] = React.useState("");
  const [beamCategory, setBeamCategory] = React.useState("");

  // Fire: cascading brand → model
  const fireBrands = [...new Set(FIRE_OPTIONS.map((f) => f.brand))];
  const fireModelsForBrand = FIRE_OPTIONS.filter((f) => f.brand === data.fire.brand);


  // Surround: cascading brand → model
  const surroundBrands = [...new Set(SURROUND_OPTIONS.map((s) => s.brand))];
  const surroundModelsForBrand = SURROUND_OPTIONS.filter(
    (s) => s.brand === (data.surround as any).brand
  );
  const surroundBrand = (data.surround as any).brand || "";

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Fire/Appliance */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Fire / Appliance *</Label>
        <div>
          <Label className="text-xs">Supplier</Label>
          <Select
            value={data.fire.brand || undefined}
            onValueChange={(brand) => {
              onChange({
                ...data,
                fire: { brand, model: brand === "Customer's Own" ? "Customer's Own" : "", kw: "", price: 0 },
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Customer's Own">Customer's Own</SelectItem>
              {fireBrands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {data.fire.brand && data.fire.brand !== "Customer's Own" && (
          <div>
            <Label className="text-xs">Model</Label>
            <Select
              value={data.fire.model || undefined}
              onValueChange={(model) => {
                const item = FIRE_OPTIONS.find(
                  (f) => f.brand === data.fire.brand && f.model === model
                );
                if (item) {
                  onChange({
                    ...data,
                    fire: {
                      brand: item.brand,
                      model: item.model,
                      kw: item.kw || "",
                      price: item.price,
                    },
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose model" />
              </SelectTrigger>
              <SelectContent>
                {fireModelsForBrand.map((f) => (
                  <SelectItem key={f.model} value={f.model}>
                    {f.model} — £{f.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {data.fire.brand === "Customer's Own" && (
          <div>
            <Label className="text-xs">Description</Label>
            <Input
              value={data.fire.model}
              onChange={(e) => onChange({ ...data, fire: { ...data.fire, model: e.target.value } })}
              placeholder="Describe the customer's fire"
            />
          </div>
        )}
        {showKw && data.fire.kw && (
          <p className="text-xs text-muted-foreground">kW Output: {data.fire.kw}</p>
        )}
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput
            value={data.fire.price}
            onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })}
          />
        </div>
      </div>

      {/* Capital Fireplaces */}
      <OptionalSection
        title="Fireplace (Capital)"
        enabled={data.fireplace.enabled}
        onToggle={(v) => {
          onChange({ ...data, fireplace: { ...data.fireplace, enabled: v } });
          if (!v) setFireplaceMaterial("");
        }}
      >
        <div>
          <Label className="text-xs">Material</Label>
          <Select
            value={fireplaceMaterial || undefined}
            onValueChange={(val) => {
              setFireplaceMaterial(val);
              onChange({ ...data, fireplace: { ...data.fireplace, description: "", price: 0 } });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose material" />
            </SelectTrigger>
            <SelectContent>
              {CAPITAL_FIREPLACE_MATERIALS.map((m) => (
                <SelectItem key={m.material} value={m.material}>
                  {m.material}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {fireplaceMaterial && (() => {
          const products = CAPITAL_FIREPLACE_MATERIALS.find((m) => m.material === fireplaceMaterial)?.products || [];
          return (
            <div>
              <Label className="text-xs">Product</Label>
              <Select
                value={data.fireplace.description || undefined}
                onValueChange={(val) => {
                  const item = products.find((p) => p.name === val);
                  if (item) {
                    onChange({ ...data, fireplace: { ...data.fireplace, description: `${item.name} (${item.rebate} rebate)`, price: item.price } });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p, i) => (
                    <SelectItem key={`${p.name}-${p.rebate}-${i}`} value={p.name}>
                      {p.name} (Rebate: {p.rebate}) — £{p.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })()}
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.fireplace.price} onChange={(v) => onChange({ ...data, fireplace: { ...data.fireplace, price: v } })} />
        </div>
      </OptionalSection>

      {/* Capital Hearths */}
      <OptionalSection
        title="Hearth (Capital)"
        enabled={data.hearth.enabled}
        onToggle={(v) => {
          onChange({ ...data, hearth: { ...data.hearth, enabled: v } });
          if (!v) { setHearthMaterial(""); setHearthType(""); }
        }}
      >
        <div>
          <Label className="text-xs">Material</Label>
          <Select
            value={hearthMaterial || undefined}
            onValueChange={(val) => {
              setHearthMaterial(val);
              setHearthType("");
              onChange({ ...data, hearth: { ...data.hearth, description: "", price: 0 } });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose material" />
            </SelectTrigger>
            <SelectContent>
              {CAPITAL_HEARTHS.map((c) => (
                <SelectItem key={c.material} value={c.material}>
                  {c.material}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hearthMaterial && (
          <div>
            <Label className="text-xs">Type</Label>
            <Select
              value={hearthType || undefined}
              onValueChange={(val) => {
                setHearthType(val);
                onChange({ ...data, hearth: { ...data.hearth, description: "", price: 0 } });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose type" />
              </SelectTrigger>
              <SelectContent>
                {CAPITAL_HEARTHS.find((c) => c.material === hearthMaterial)?.types.map((t) => (
                  <SelectItem key={t.type} value={t.type}>
                    {t.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {hearthMaterial && hearthType && (() => {
          const products = CAPITAL_HEARTHS
            .find((c) => c.material === hearthMaterial)
            ?.types.find((t) => t.type === hearthType)?.products || [];
          return (
            <div>
              <Label className="text-xs">Product</Label>
              <Select
                value={data.hearth.description || undefined}
                onValueChange={(val) => {
                  const item = products.find((p) => p.name === val);
                  if (item) {
                    onChange({ ...data, hearth: { ...data.hearth, description: item.name, price: item.price } });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name} — £{p.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })()}
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.hearth.price} onChange={(v) => onChange({ ...data, hearth: { ...data.hearth, price: v } })} />
        </div>
      </OptionalSection>

      {/* Chamber */}
      <OptionalSection
        title="Chamber"
        enabled={data.chamber.enabled}
        onToggle={(v) => onChange({ ...data, chamber: { ...data.chamber, enabled: v } })}
      >
        <div>
          <Label className="text-xs">Select Chamber</Label>
          <Select
            value={data.chamber.description || undefined}
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

      {/* Beam (Capital Geocast) */}
      <OptionalSection
        title="Beam (Capital Geocast)"
        enabled={data.beam.enabled}
        onToggle={(v) => {
          onChange({
            ...data,
            beam: { ...data.beam, enabled: v },
            surround: { ...data.surround, enabled: v ? false : data.surround.enabled },
          });
          if (!v) setBeamCategory("");
        }}
      >
        <div>
          <Label className="text-xs">Category</Label>
          <Select
            value={beamCategory || undefined}
            onValueChange={(val) => {
              setBeamCategory(val);
              onChange({ ...data, beam: { ...data.beam, description: "", material: val, price: 0 } });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {CAPITAL_BEAM_CATEGORIES.map((c) => (
                <SelectItem key={c.category} value={c.category}>
                  {c.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {beamCategory && (() => {
          const products = CAPITAL_BEAM_CATEGORIES.find((c) => c.category === beamCategory)?.products || [];
          return (
            <div>
              <Label className="text-xs">Product</Label>
              <Select
                value={data.beam.description || undefined}
                onValueChange={(val) => {
                  const item = products.find((p) => `${p.name} (${p.finish})` === val);
                  if (item) {
                    onChange({ ...data, beam: { ...data.beam, description: `${item.name} (${item.finish})`, material: beamCategory, price: item.price } });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose beam" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p, i) => (
                    <SelectItem key={`${p.name}-${p.finish}-${i}`} value={`${p.name} (${p.finish})`}>
                      {p.name} — {p.finish} — £{p.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })()}
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.beam.price} onChange={(v) => onChange({ ...data, beam: { ...data.beam, price: v } })} />
        </div>
      </OptionalSection>

      {/* Surround */}
      <OptionalSection
        title="Surround"
        enabled={data.surround.enabled}
        onToggle={(v) =>
          onChange({
            ...data,
            surround: { ...data.surround, enabled: v },
            beam: { ...data.beam, enabled: v ? false : data.beam.enabled },
          })
        }
      >
        <div>
          <Label className="text-xs">Supplier</Label>
          <Select
            value={surroundBrand || undefined}
            onValueChange={(brand) => {
              onChange({
                ...data,
                surround: { enabled: true, description: "", price: 0, brand, model: "" } as any,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose supplier" />
            </SelectTrigger>
            <SelectContent>
              {surroundBrands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {surroundBrand && (
          <div>
            <Label className="text-xs">Model</Label>
            <Select
              value={(data.surround as any).model || undefined}
              onValueChange={(model) => {
                const item = SURROUND_OPTIONS.find(
                  (s) => s.brand === surroundBrand && s.model === model
                );
                if (item) {
                  onChange({
                    ...data,
                    surround: {
                      enabled: true,
                      description: item.label,
                      price: item.price,
                      brand: item.brand,
                      model: item.model,
                    } as any,
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose model" />
              </SelectTrigger>
              <SelectContent>
                {surroundModelsForBrand.map((s) => (
                  <SelectItem key={s.model} value={s.model}>
                    {s.model} — £{s.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label className="text-xs">Price</Label>
          <PriceInput value={data.surround.price} onChange={(v) => onChange({ ...data, surround: { ...data.surround, price: v } })} />
        </div>
      </OptionalSection>
    </div>
  );
}
