
import { Products, JobType } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
  
  BEAM_OPTIONS,
  CAPITAL_HEARTHS,
  CHAMBER_BOARD_VARIANTS,
  CHAMBER_BOARD_NOTE,
  REEDED_PANELS_PRICE,
  CHAMBER_TRIM_KIT_PRICE,
  FERMACELL_BOARD_PRICE,
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

      {/* Surround (Capital Fireplaces) */}
      <OptionalSection
        title="Surround (Capital)"
        enabled={data.surround.enabled}
        onToggle={(v) => {
          onChange({
            ...data,
            surround: { ...data.surround, enabled: v },
            beam: { ...data.beam, enabled: v ? false : data.beam.enabled },
          });
          if (!v) setFireplaceMaterial("");
        }}
      >
        <div>
          <Label className="text-xs">Material</Label>
          <Select
            value={fireplaceMaterial || undefined}
            onValueChange={(val) => {
              setFireplaceMaterial(val);
              onChange({ ...data, surround: { ...data.surround, description: "", price: 0 } });
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
                value={data.surround.description || undefined}
                onValueChange={(val) => {
                  const item = products.find((p) => p.name === val);
                  if (item) {
                    onChange({ ...data, surround: { ...data.surround, description: `${item.name} (${item.rebate} rebate)`, price: item.price } });
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
          <PriceInput value={data.surround.price} onChange={(v) => onChange({ ...data, surround: { ...data.surround, price: v } })} />
        </div>
      </OptionalSection>

      {/* Chamber Boards */}
      <OptionalSection
        title="Chamber Boards"
        enabled={data.chamberBoard.enabled}
        onToggle={(v) =>
          onChange({
            ...data,
            chamberBoard: v
              ? data.chamberBoard.enabled
                ? data.chamberBoard
                : { ...data.chamberBoard, enabled: true }
              : {
                  enabled: false,
                  boardName: "",
                  boardPrice: 0,
                  reededPanels: false,
                  chamberTrimKit: false,
                  chamberTrimColour: "Black",
                  
                },
          })
        }
      >
        {/* Board selection */}
        <div>
          <Label className="text-xs">Board Design</Label>
          <Select
            value={data.chamberBoard.boardName || undefined}
            onValueChange={(val) => {
              const item = CHAMBER_BOARD_VARIANTS.find((v) => v.name === val);
              if (item) {
                onChange({
                  ...data,
                  chamberBoard: {
                    ...data.chamberBoard,
                    boardName: item.name,
                    boardPrice: item.price,
                  },
                });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose board design" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {CHAMBER_BOARD_VARIANTS.map((v) => (
                <SelectItem key={v.name} value={v.name}>
                  {v.name} — £{v.price.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground mt-1">{CHAMBER_BOARD_NOTE}</p>
        </div>

        <div>
          <Label className="text-xs">Board Price</Label>
          <PriceInput
            value={data.chamberBoard.boardPrice}
            onChange={(v) =>
              onChange({ ...data, chamberBoard: { ...data.chamberBoard, boardPrice: v } })
            }
          />
        </div>

        {/* Cast Reeded Infill Panels */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium">Cast Reeded Infill Panels</Label>
            <p className="text-[10px] text-muted-foreground">4× 915mm × 380mm × 7mm — £{REEDED_PANELS_PRICE.toFixed(2)}</p>
          </div>
          <Switch
            checked={data.chamberBoard.reededPanels}
            onCheckedChange={(v) =>
              onChange({ ...data, chamberBoard: { ...data.chamberBoard, reededPanels: v } })
            }
          />
        </div>

        {/* Chamber Trim Kit — checkbox */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="chamberTrimKit"
              checked={data.chamberBoard.chamberTrimKit}
              onCheckedChange={(v) =>
                onChange({
                  ...data,
                  chamberBoard: { ...data.chamberBoard, chamberTrimKit: v === true },
                })
              }
            />
            <Label htmlFor="chamberTrimKit" className="text-xs font-medium cursor-pointer">
              Add Chamber Trim Kit (+£{CHAMBER_TRIM_KIT_PRICE.toFixed(2)} ex VAT)
            </Label>
          </div>
          {data.chamberBoard.chamberTrimKit && (
            <div>
              <Label className="text-xs">Colour</Label>
              <Select
                value={data.chamberBoard.chamberTrimColour}
                onValueChange={(val) =>
                  onChange({
                    ...data,
                    chamberBoard: {
                      ...data.chamberBoard,
                      chamberTrimColour: val as "Black" | "Stainless Steel",
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

      </OptionalSection>
    </div>
  );
}
