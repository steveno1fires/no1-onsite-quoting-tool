import { Products, JobType, ElectricStyle, BfFitting, GasFireTrim } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BEAM_OPTIONS,
  CAPITAL_HEARTHS,
  CHAMBER_BOARD_VARIANTS,
  CHAMBER_BOARD_NOTE,
  REEDED_PANELS_PRICE,
  CHAMBER_TRIM_KIT_PRICE,
} from "@/data/productCatalog";
import {
  WOODBURNER_PRODUCTS,
  GAS_BF_PRODUCTS,
  GAS_CF_PRODUCTS,
  GAS_STOVE_PRODUCTS,
  ELECTRIC_FIRE_TABS,
  GAS_FIRE_TRIMS,
  GATHER_HOOD_PRICES,
  CJ_COMPATIBLE_FIREPLACES,
  CJ_16_INCH_FIRES,
} from "@/data/fireProductsByJobType";
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

// ─────────────────────────────────────────────
//  WOODBURNER fire section
// ─────────────────────────────────────────────
function WoodburnerSection({ data, onChange }: { data: Products; onChange: (d: Products) => void }) {
  const brands = [...new Set(WOODBURNER_PRODUCTS.map((p) => p.brand))];
  const modelsForBrand = WOODBURNER_PRODUCTS.filter((p) => p.brand === data.fire.brand);

  return (
    <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
      <Label className="text-sm font-semibold">Woodburner / Stove *</Label>
      <div>
        <Label className="text-xs">Supplier</Label>
        <Select
          value={data.fire.brand || undefined}
          onValueChange={(brand) => {
            onChange({ ...data, fire: { brand, model: brand === "Customer's Own" ? "Customer's Own" : "", kw: "", price: 0 } });
          }}
        >
          <SelectTrigger><SelectValue placeholder="Choose supplier" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Customer's Own">Customer's Own</SelectItem>
            {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {data.fire.brand && data.fire.brand !== "Customer's Own" && (
        <div>
          <Label className="text-xs">Model</Label>
          <Select
            value={data.fire.model || undefined}
            onValueChange={(model) => {
              const item = WOODBURNER_PRODUCTS.find((p) => p.brand === data.fire.brand && p.name === model);
              if (item) {
                onChange({ ...data, fire: { brand: item.brand, model: item.name, kw: item.kw ? String(item.kw) : "", price: item.rrp } });
              }
            }}
          >
            <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
            <SelectContent>
              {modelsForBrand.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}{p.kw ? ` (${p.kw}kW)` : ""} — £{p.rrp}
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
            placeholder="Describe the customer's stove"
          />
        </div>
      )}
      {data.fire.kw && <p className="text-xs text-muted-foreground">kW Output: {data.fire.kw}</p>}
      <div>
        <Label className="text-xs">Price</Label>
        <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  GAS FIRE section (BF or CF)
// ─────────────────────────────────────────────
function GasFireSection({
  data,
  onChange,
  products,
  title,
}: {
  data: Products;
  onChange: (d: Products) => void;
  products: typeof GAS_BF_PRODUCTS;
  title: string;
}) {
  const subCategories = [...new Set(products.map((p) => p.subCategory))];
  const [selectedSubCat, setSelectedSubCat] = React.useState(subCategories[0] || "");
  const [controlType, setControlType] = React.useState<"slide" | "remote">("slide");

  const productsInCat = products.filter((p) => p.subCategory === selectedSubCat);
  const selectedProduct = products.find((p) => p.name === data.fire.model);
  const hasControlOptions = selectedProduct && selectedProduct.price === undefined;

  // Trim config for current model + control type
  const trimConfig = data.fire.model ? GAS_FIRE_TRIMS[data.fire.model]?.[controlType] : undefined;
  const hasFascias      = (trimConfig?.fascias.length ?? 0) > 0;
  const hasFrets        = (trimConfig?.frets.length ?? 0) > 0;
  const hasStandardTrims = (trimConfig?.standardTrims.length ?? 0) > 0;
  const hasTrimSection  = hasFascias || hasFrets;

  // Gather hood
  const gatherHoodPrice = data.fire.model ? GATHER_HOOD_PRICES[data.fire.model] : undefined;

  // C&J compatible fireplaces
  const cjFireplaceOptions = data.fire.model ? CJ_COMPATIBLE_FIREPLACES[data.fire.model] : undefined;

  const handleProductSelect = (productName: string) => {
    const item = productsInCat.find((p) => p.name === productName);
    if (!item) return;
    const price = item.price !== undefined
      ? item.price
      : controlType === "remote" && item.remoteControlNg !== undefined
        ? item.remoteControlNg
        : item.slideControlNg || 0;
    onChange({
      ...data,
      fire: { brand: "C&J", model: item.name, kw: "", price },
      gasFireTrim: null,
      gasFireGatherHood: { enabled: false, priceExVat: 0 },
      cjFireplace: null,
    });
  };

  const handleControlChange = (ct: "slide" | "remote") => {
    setControlType(ct);
    const item = products.find((p) => p.name === data.fire.model);
    if (item && item.price === undefined) {
      const price = ct === "remote" && item.remoteControlNg !== undefined
        ? item.remoteControlNg
        : item.slideControlNg || 0;
      onChange({ ...data, fire: { ...data.fire, price }, gasFireTrim: null });
    } else {
      onChange({ ...data, gasFireTrim: null });
    }
  };

  // Which fret is currently selected (if any)
  const selectedFret = data.gasFireTrim && !data.gasFireTrim.pairedTrimName
    ? null
    : data.gasFireTrim?.pairedTrimName !== undefined
      ? data.gasFireTrim
      : null;
  const isFretSelected = !!data.gasFireTrim?.pairedTrimName !== undefined && data.gasFireTrim?.pairedTrimName !== undefined;
  const currentFretName = data.gasFireTrim?.pairedTrimName !== undefined ? data.gasFireTrim?.name : undefined;

  return (
    <div className="space-y-3">
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">{title} *</Label>

        <div>
          <Label className="text-xs">Category</Label>
          <Select
            value={selectedSubCat}
            onValueChange={(val) => {
              setSelectedSubCat(val);
              onChange({
                ...data,
                fire: { brand: "", model: "", kw: "", price: 0 },
                gasFireTrim: null,
                gasFireGatherHood: { enabled: false, priceExVat: 0 },
                cjFireplace: null,
              });
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {subCategories.map((sc) => <SelectItem key={sc} value={sc}>{sc}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Model</Label>
          <Select
            value={data.fire.model || undefined}
            onValueChange={handleProductSelect}
          >
            <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
            <SelectContent>
              {productsInCat.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name}
                  {p.description ? ` — ${p.description}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {data.fire.model && hasControlOptions && (
          <div className="space-y-1">
            <Label className="text-xs">Control Type</Label>
            <RadioGroup
              value={controlType}
              onValueChange={(v) => handleControlChange(v as "slide" | "remote")}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="slide" id="ctrl-slide" />
                <Label htmlFor="ctrl-slide" className="text-xs cursor-pointer">
                  Slide Control
                  {selectedProduct?.slideControlNg != null && ` — £${selectedProduct.slideControlNg.toFixed(2)}`}
                </Label>
              </div>
              {selectedProduct?.remoteControlNg != null && (
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="remote" id="ctrl-remote" />
                  <Label htmlFor="ctrl-remote" className="text-xs cursor-pointer">
                    Remote Control — £{selectedProduct.remoteControlNg.toFixed(2)}
                  </Label>
                </div>
              )}
            </RadioGroup>
          </div>
        )}

        <div>
          <Label className="text-xs">Price ex VAT</Label>
          <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
        </div>
      </div>

      {/* ── Trim / Fascia selector ── */}
      {data.fire.model && hasTrimSection && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border-t-2 border-primary/20">
          <Label className="text-sm font-semibold">Trim / Fascia (optional)</Label>

          {/* ── FASCIAS — standalone, no fret needed ── */}
          {hasFascias && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">All-in-one Fascias</Label>
              <Select
                value={(!data.gasFireTrim?.pairedTrimName && data.gasFireTrim?.name) ? data.gasFireTrim.name : "__none__"}
                onValueChange={(val) => {
                  if (val === "__none__") {
                    onChange({ ...data, gasFireTrim: null });
                  } else {
                    const item = trimConfig!.fascias.find((f) => f.name === val);
                    if (item) onChange({ ...data, gasFireTrim: { name: item.name, priceExVat: item.priceExVat } });
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="No fascia" /></SelectTrigger>
                <SelectContent className="max-h-[280px] overflow-y-auto">
                  <SelectItem value="__none__">No fascia</SelectItem>
                  {trimConfig!.fascias.map((f) => (
                    <SelectItem key={f.name} value={f.name}>
                      {f.name} — £{f.priceExVat.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ── FRETS — selecting one reveals a mandatory standard trim ── */}
          {hasFrets && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                — or choose a Fret (then select matching Standard Trim below)
              </Label>
              <Select
                value={data.gasFireTrim?.pairedTrimName !== undefined ? data.gasFireTrim?.name : "__none__"}
                onValueChange={(val) => {
                  if (val === "__none__") {
                    onChange({ ...data, gasFireTrim: null });
                  } else {
                    const fret = trimConfig!.frets.find((f) => f.name === val);
                    if (fret) {
                      // Store fret, clear pairedTrim until user picks it
                      onChange({
                        ...data,
                        gasFireTrim: {
                          name: fret.name,
                          priceExVat: fret.priceExVat,
                          pairedTrimName: "",   // empty string = fret chosen but trim not yet picked
                          pairedTrimPrice: 0,
                        },
                      });
                    }
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="No fret" /></SelectTrigger>
                <SelectContent className="max-h-[280px] overflow-y-auto">
                  <SelectItem value="__none__">No fret</SelectItem>
                  {trimConfig!.frets.map((f) => (
                    <SelectItem key={f.name} value={f.name}>
                      {f.name} — £{f.priceExVat.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Standard Trim — only shown after a fret is selected */}
              {data.gasFireTrim?.pairedTrimName !== undefined && hasStandardTrims && (
                <div className="mt-2 space-y-1 pl-3 border-l-2 border-amber-400">
                  <Label className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    Standard Trim required with this fret *
                  </Label>
                  <Select
                    value={data.gasFireTrim.pairedTrimName || "__pick__"}
                    onValueChange={(val) => {
                      const trim = trimConfig!.standardTrims.find((t) => t.name === val);
                      if (trim && data.gasFireTrim) {
                        onChange({
                          ...data,
                          gasFireTrim: {
                            ...data.gasFireTrim,
                            pairedTrimName: trim.name,
                            pairedTrimPrice: trim.priceExVat,
                          },
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="border-amber-400"><SelectValue placeholder="Choose standard trim…" /></SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {trimConfig!.standardTrims.map((t) => (
                        <SelectItem key={t.name} value={t.name}>
                          {t.name} — £{t.priceExVat.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Summary of current selection */}
          {data.gasFireTrim && (
            <div className="text-xs text-muted-foreground space-y-0.5 pt-1 border-t border-border">
              {data.gasFireTrim.pairedTrimName !== undefined ? (
                <>
                  <p>Fret: {data.gasFireTrim.name} — £{data.gasFireTrim.priceExVat.toFixed(2)} ex VAT</p>
                  {data.gasFireTrim.pairedTrimName
                    ? <p>Standard Trim: {data.gasFireTrim.pairedTrimName} — £{(data.gasFireTrim.pairedTrimPrice ?? 0).toFixed(2)} ex VAT</p>
                    : <p className="text-amber-600 font-medium">⚠ Standard trim not yet selected</p>
                  }
                </>
              ) : (
                <p>Fascia: {data.gasFireTrim.name} — £{data.gasFireTrim.priceExVat.toFixed(2)} ex VAT</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Gather Hood ── */}
      {data.fire.model && gatherHoodPrice !== undefined && (
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Checkbox
              id="gather-hood"
              checked={data.gasFireGatherHood.enabled}
              onCheckedChange={(v) =>
                onChange({
                  ...data,
                  gasFireGatherHood: { enabled: v === true, priceExVat: v === true ? gatherHoodPrice : 0 },
                })
              }
            />
            <label htmlFor="gather-hood" className="text-sm font-medium cursor-pointer">
              Gather Hood (+£{gatherHoodPrice.toFixed(2)} ex VAT)
            </label>
          </div>
        </div>
      )}

      {/* ── C&J Compatible Limestone Fireplace ── */}
      {data.fire.model && cjFireplaceOptions && cjFireplaceOptions.length > 0 && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border-t-2 border-primary/20">
          <Label className="text-sm font-semibold">C&J Portuguese Limestone Fireplace (optional)</Label>
          <p className="text-xs text-muted-foreground">Designed to complement this fire — surround, hearth & back panel options</p>
          <Select
            value={data.cjFireplace?.name ?? "__none__"}
            onValueChange={(val) => {
              if (val === "__none__") {
                onChange({ ...data, cjFireplace: null });
              } else {
                const item = cjFireplaceOptions.find((p) => p.name === val);
                if (item) onChange({ ...data, cjFireplace: { name: item.name, priceExVat: item.priceExVat, description: item.description } });
              }
            }}
          >
            <SelectTrigger><SelectValue placeholder="No C&J fireplace" /></SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="__none__">No C&J fireplace</SelectItem>
              {cjFireplaceOptions.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name} — £{p.priceExVat.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data.cjFireplace && (
            <p className="text-xs text-muted-foreground">{data.cjFireplace.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  GAS STOVE section (conventional flue or balanced flue)
// ─────────────────────────────────────────────
function GasStoveSection({ data, onChange }: { data: Products; onChange: (d: Products) => void }) {
  return (
    <>
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Gas Stove *</Label>
        <div>
          <Label className="text-xs">Model</Label>
          <Select
            value={data.fire.model || undefined}
            onValueChange={(name) => {
              const item = GAS_STOVE_PRODUCTS.find((p) => p.name === name);
              if (item) {
                onChange({ ...data, fire: { brand: "C&J", model: item.name, kw: "", price: item.priceExVat } });
              }
            }}
          >
            <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
            <SelectContent>
              {GAS_STOVE_PRODUCTS.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name} ({p.fuel}) — £{p.priceExVat.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Price ex VAT</Label>
          <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
        </div>
      </div>

    </>
  );
}

// ─────────────────────────────────────────────
//  ELECTRIC FIRE / MEDIA WALL section
// ─────────────────────────────────────────────
function ElectricFireSection({ data, onChange }: { data: Products; onChange: (d: Products) => void }) {
  const [activeTab, setActiveTab] = React.useState(ELECTRIC_FIRE_TABS[0].tabName);
  const [realLogsChecked, setRealLogsChecked] = React.useState(false);
  const [woodLogSetChecked, setWoodLogSetChecked] = React.useState(false);

  const currentTab = ELECTRIC_FIRE_TABS.find((t) => t.tabName === activeTab) || ELECTRIC_FIRE_TABS[0];

  const handleProductSelect = (name: string) => {
    const item = currentTab.products.find((p) => p.name === name);
    if (!item) return;
    let price = item.priceExVat;
    if (realLogsChecked && currentTab.realLogsUpgrade) price += currentTab.realLogsUpgrade.price;
    if (woodLogSetChecked && currentTab.optionalWoodLogSet) price += currentTab.optionalWoodLogSet.price;
    onChange({ ...data, fire: { brand: "C&J", model: item.name, kw: "", price } });
  };

  const recalcPrice = (productName: string, rl: boolean, wl: boolean) => {
    const item = currentTab.products.find((p) => p.name === productName);
    if (!item) return;
    let price = item.priceExVat;
    if (rl && currentTab.realLogsUpgrade) price += currentTab.realLogsUpgrade.price;
    if (wl && currentTab.optionalWoodLogSet) price += currentTab.optionalWoodLogSet.price;
    onChange({ ...data, fire: { ...data.fire, price } });
  };

  const mwItems = data.mediaWallItems;

  return (
    <div className="space-y-4">
      {/* Style selector */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Installation Style *</Label>
        <RadioGroup
          value={data.electricStyle}
          onValueChange={(v) => onChange({ ...data, electricStyle: v as ElectricStyle, fire: { brand: "", model: "", kw: "", price: 0 } })}
          className="space-y-2"
        >
          {(["Media Wall", "Hole in the Wall", "With Fireplace", "16 Inch Fire with Fireplace"] as ElectricStyle[]).map((style) => (
            <div key={style} className="flex items-center gap-2">
              <RadioGroupItem value={style} id={`style-${style}`} />
              <Label htmlFor={`style-${style}`} className="text-sm cursor-pointer">{style}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* 16 Inch Fire product selector */}
      {data.electricStyle === "16 Inch Fire with Fireplace" && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
          <Label className="text-sm font-semibold">C&J 16" Electric Fire *</Label>
          <p className="text-xs text-muted-foreground">Choose model complete with fascia — prices ex VAT</p>
          <Select
            value={data.fire.model || undefined}
            onValueChange={(name) => {
              const item = CJ_16_INCH_FIRES.find((p) => p.name === name);
              if (item) {
                onChange({ ...data, fire: { brand: "C&J", model: item.name, kw: "", price: item.priceExVat } });
              }
            }}
          >
            <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {CJ_16_INCH_FIRES.map((p) => (
                <SelectItem key={p.name} value={p.name}>
                  {p.name} — £{p.priceExVat.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {data.fire.model && (() => {
            const item = CJ_16_INCH_FIRES.find((p) => p.name === data.fire.model);
            return item ? <p className="text-xs text-muted-foreground">{item.description}</p> : null;
          })()}
          <div>
            <Label className="text-xs">Price ex VAT</Label>
            <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
          </div>
        </div>
      )}

      {/* Fire product selector — iRange / Luminosa (not shown for 16 inch style) */}
      {data.electricStyle !== "16 Inch Fire with Fireplace" && (
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Electric Fire *</Label>
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            setRealLogsChecked(false);
            setWoodLogSetChecked(false);
            onChange({ ...data, fire: { brand: "", model: "", kw: "", price: 0 } });
          }}
        >
          <TabsList className="w-full grid grid-cols-3">
            {ELECTRIC_FIRE_TABS.map((t) => (
              <TabsTrigger key={t.tabName} value={t.tabName} className="text-xs">{t.tabName}</TabsTrigger>
            ))}
          </TabsList>
          {ELECTRIC_FIRE_TABS.map((tab) => (
            <TabsContent key={tab.tabName} value={tab.tabName} className="space-y-3">
              {tab.note && <p className="text-xs text-muted-foreground">{tab.note}</p>}
              <div>
                <Label className="text-xs">Model</Label>
                <Select
                  value={data.fire.model || undefined}
                  onValueChange={handleProductSelect}
                >
                  <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
                  <SelectContent>
                    {tab.products.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name} ({p.widthMm}mm) — £{p.priceExVat.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Real Logs upgrade */}
              {tab.realLogsUpgrade && data.fire.model && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`real-logs-${tab.tabName}`}
                    checked={realLogsChecked}
                    onCheckedChange={(v) => {
                      const checked = v === true;
                      setRealLogsChecked(checked);
                      recalcPrice(data.fire.model, checked, woodLogSetChecked);
                    }}
                  />
                  <Label htmlFor={`real-logs-${tab.tabName}`} className="text-xs cursor-pointer">
                    {tab.realLogsUpgrade.label} upgrade (+£{tab.realLogsUpgrade.price.toFixed(2)})
                  </Label>
                </div>
              )}
              {/* Optional Wood Log Set (Deep only) */}
              {tab.optionalWoodLogSet && data.fire.model && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`wood-log-set-${tab.tabName}`}
                    checked={woodLogSetChecked}
                    onCheckedChange={(v) => {
                      const checked = v === true;
                      setWoodLogSetChecked(checked);
                      recalcPrice(data.fire.model, realLogsChecked, checked);
                    }}
                  />
                  <Label htmlFor={`wood-log-set-${tab.tabName}`} className="text-xs cursor-pointer">
                    {tab.optionalWoodLogSet.label} (+£{tab.optionalWoodLogSet.price.toFixed(2)})
                  </Label>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        <div>
          <Label className="text-xs">Price ex VAT</Label>
          <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
        </div>
      </div>
      )}

      {/* Media Wall extras — only when Media Wall style is selected */}
      {data.electricStyle === "Media Wall" && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-4">
          <Label className="text-sm font-semibold">Media Wall Materials</Label>

          {/* Quantity items */}
          <div className="space-y-3">
            {[
              { key: "clsTimberQty" as const, label: "CLS Timber", unit: "lengths" },
              { key: "plasterboardQty" as const, label: "Plasterboard", unit: "sheets" },
              { key: "cornerBeadQty" as const, label: "Corner Bead", unit: "lengths" },
            ].map(({ key, label, unit }) => (
              <div key={key} className="flex items-center gap-3">
                <Label className="text-xs w-32 shrink-0">{label}</Label>
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={mwItems[key] || ""}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      onChange({ ...data, mediaWallItems: { ...mwItems, [key]: qty } });
                    }}
                    className="w-20 text-sm"
                    placeholder="0"
                  />
                  <span className="text-xs text-muted-foreground">× £1 each</span>
                  {mwItems[key] > 0 && (
                    <span className="text-xs font-medium">= £{mwItems[key].toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox add-ons */}
          <div className="space-y-2 pt-1 border-t border-border">
            <div className="flex items-center gap-2">
              <Checkbox
                id="tv-bracket"
                checked={mwItems.tvBracket}
                onCheckedChange={(v) => onChange({ ...data, mediaWallItems: { ...mwItems, tvBracket: v === true } })}
              />
              <Label htmlFor="tv-bracket" className="text-xs cursor-pointer font-medium">
                TV Bracket (+£150.00 ex VAT)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="plastered"
                checked={mwItems.plastered}
                onCheckedChange={(v) => onChange({ ...data, mediaWallItems: { ...mwItems, plastered: v === true } })}
              />
              <Label htmlFor="plastered" className="text-xs cursor-pointer font-medium">
                Plastered (+£450.00 ex VAT)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="electric-sockets"
                checked={mwItems.electricSockets}
                onCheckedChange={(v) => onChange({ ...data, mediaWallItems: { ...mwItems, electricSockets: v === true } })}
              />
              <Label htmlFor="electric-sockets" className="text-xs cursor-pointer font-medium">
                Electric (2x double sockets only) (+£275.00 ex VAT)
              </Label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN StepProducts component
// ─────────────────────────────────────────────
export function StepProducts({ data, jobType, onChange }: Props) {
  const [hearthMaterial, setHearthMaterial] = React.useState(CAPITAL_HEARTHS[0]?.material || "");
  const [hearthType, setHearthType] = React.useState("");
  const [fireplaceMaterial, setFireplaceMaterial] = React.useState("");
  const [beamCategory, setBeamCategory] = React.useState("");

  const isElectric = jobType === "Electric Fire / Media Wall";
  const electricStyle = data.electricStyle;

  // Which optional sections to show
  const showHearth = !isElectric || electricStyle === "Hole in the Wall" || electricStyle === "With Fireplace" || electricStyle === "16 Inch Fire with Fireplace";
  const showSurround = !isElectric || electricStyle === "With Fireplace" || electricStyle === "16 Inch Fire with Fireplace";
  const showBeam = !isElectric || electricStyle === "Hole in the Wall";
  const showChamberBoard = !isElectric;

  // Render the correct fire/appliance section based on job type
  const renderFireSection = () => {
    switch (jobType) {
      case "Woodburner — Chimney Liner":
      case "Woodburner — Twin Wall":
        return <WoodburnerSection data={data} onChange={onChange} />;
      case "Gas Fire — Balanced Flue (BF)":
        return (
          <GasFireSection
            data={data}
            onChange={onChange}
            products={GAS_BF_PRODUCTS}
            title="Gas Fire — Balanced Flue"
          />
        );
      case "Gas Fire — Inset (Conventional Flue)":
        return (
          <GasFireSection
            data={data}
            onChange={onChange}
            products={GAS_CF_PRODUCTS}
            title="Gas Fire — Inset (CF)"
          />
        );
      case "Gas Stove":
        return <GasStoveSection data={data} onChange={onChange} />;
      case "Electric Fire / Media Wall":
        return <ElectricFireSection data={data} onChange={onChange} />;
      default:
        return (
          <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
            <Label className="text-sm font-semibold">Fire / Appliance *</Label>
            <div>
              <Label className="text-xs">Description</Label>
              <Input
                value={data.fire.model}
                onChange={(e) => onChange({ ...data, fire: { ...data.fire, model: e.target.value } })}
                placeholder="Describe the appliance"
              />
            </div>
            <div>
              <Label className="text-xs">Price</Label>
              <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Fire / Appliance — conditional by job type */}
      {renderFireSection()}

      {/* Capital Hearths */}
      {showHearth && (
        <OptionalSection
          title="Hearth (Capital)"
          enabled={data.hearth.enabled}
          onToggle={(v) => {
            onChange({ ...data, hearth: { ...data.hearth, enabled: v } });
            if (!v) { setHearthMaterial(""); setHearthType(""); }
          }}
        >
          <Tabs
            value={hearthMaterial || CAPITAL_HEARTHS[0]?.material}
            onValueChange={(val) => {
              setHearthMaterial(val);
              setHearthType("");
              onChange({ ...data, hearth: { ...data.hearth, description: "", price: 0, description2: "", price2: 0 } });
            }}
          >
            <TabsList className="w-full grid grid-cols-3">
              {CAPITAL_HEARTHS.map((c) => (
                <TabsTrigger key={c.material} value={c.material} className="text-xs">{c.material}</TabsTrigger>
              ))}
            </TabsList>
            {CAPITAL_HEARTHS.map((cat) => {
              const isStoneTab = cat.material === "Granite" || cat.material === "Slate";
              return (
                <TabsContent key={cat.material} value={cat.material} className="space-y-3">
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={hearthMaterial === cat.material ? hearthType || undefined : undefined}
                      onValueChange={(val) => {
                        setHearthType(val);
                        onChange({ ...data, hearth: { ...data.hearth, description: "", price: 0, description2: "", price2: 0 } });
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Choose type" /></SelectTrigger>
                      <SelectContent>
                        {cat.types.map((t) => <SelectItem key={t.type} value={t.type}>{t.type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {hearthType && cat.types.find((t) => t.type === hearthType) && (() => {
                    const products = cat.types.find((t) => t.type === hearthType)?.products || [];
                    return (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Product 1</Label>
                          <Select
                            value={data.hearth.description || undefined}
                            onValueChange={(val) => {
                              const item = products.find((p) => p.name === val);
                              if (item) onChange({ ...data, hearth: { ...data.hearth, description: item.name, price: item.price } });
                            }}
                          >
                            <SelectTrigger><SelectValue placeholder="Choose product" /></SelectTrigger>
                            <SelectContent className="max-h-[300px] overflow-y-auto">
                              {products.map((p) => (
                                <SelectItem key={p.name} value={p.name}>{p.name} — £{p.price}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {isStoneTab && data.hearth.description && (
                          <div>
                            <Label className="text-xs">Product 2 (optional)</Label>
                            <Select
                              value={data.hearth.description2 || undefined}
                              onValueChange={(val) => {
                                if (val === "__none__") {
                                  onChange({ ...data, hearth: { ...data.hearth, description2: "", price2: 0 } });
                                } else {
                                  const item = products.find((p) => p.name === val);
                                  if (item) onChange({ ...data, hearth: { ...data.hearth, description2: item.name, price2: item.price } });
                                }
                              }}
                            >
                              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                              <SelectContent className="max-h-[300px] overflow-y-auto">
                                <SelectItem value="__none__">None</SelectItem>
                                {products.filter((p) => p.name !== data.hearth.description).map((p) => (
                                  <SelectItem key={p.name} value={p.name}>{p.name} — £{p.price}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </TabsContent>
              );
            })}
          </Tabs>
          <div>
            <Label className="text-xs">Total Hearth Price</Label>
            <PriceInput
              value={data.hearth.price + data.hearth.price2}
              onChange={(v) => onChange({ ...data, hearth: { ...data.hearth, price: v, price2: 0 } })}
            />
          </div>
        </OptionalSection>
      )}

      {/* Beam (Capital Geocast) */}
      {showBeam && (
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
              <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
              <SelectContent>
                {CAPITAL_BEAM_CATEGORIES.map((c) => (
                  <SelectItem key={c.category} value={c.category}>{c.category}</SelectItem>
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
                  <SelectTrigger><SelectValue placeholder="Choose beam" /></SelectTrigger>
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
      )}

      {/* Surround (Capital Fireplaces) */}
      {showSurround && (
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
              <SelectTrigger><SelectValue placeholder="Choose material" /></SelectTrigger>
              <SelectContent>
                {CAPITAL_FIREPLACE_MATERIALS.map((m) => (
                  <SelectItem key={m.material} value={m.material}>{m.material}</SelectItem>
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
                  <SelectTrigger><SelectValue placeholder="Choose product" /></SelectTrigger>
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
      )}

      {/* Chamber Boards */}
      {showChamberBoard && (
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
          <div>
            <Label className="text-xs">Board Design</Label>
            <Select
              value={data.chamberBoard.boardName || undefined}
              onValueChange={(val) => {
                const item = CHAMBER_BOARD_VARIANTS.find((v) => v.name === val);
                if (item) {
                  onChange({ ...data, chamberBoard: { ...data.chamberBoard, boardName: item.name, boardPrice: item.price } });
                }
              }}
            >
              <SelectTrigger><SelectValue placeholder="Choose board design" /></SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {CHAMBER_BOARD_VARIANTS.map((v) => (
                  <SelectItem key={v.name} value={v.name}>{v.name} — £{v.price.toFixed(2)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-1">{CHAMBER_BOARD_NOTE}</p>
          </div>
          <div>
            <Label className="text-xs">Board Price</Label>
            <PriceInput
              value={data.chamberBoard.boardPrice}
              onChange={(v) => onChange({ ...data, chamberBoard: { ...data.chamberBoard, boardPrice: v } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-medium">Cast Reeded Infill Panels</Label>
              <p className="text-[10px] text-muted-foreground">4× 915mm × 380mm × 7mm — £{REEDED_PANELS_PRICE.toFixed(2)}</p>
            </div>
            <Switch
              checked={data.chamberBoard.reededPanels}
              onCheckedChange={(v) => onChange({ ...data, chamberBoard: { ...data.chamberBoard, reededPanels: v } })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="chamberTrimKit"
                checked={data.chamberBoard.chamberTrimKit}
                onCheckedChange={(v) =>
                  onChange({ ...data, chamberBoard: { ...data.chamberBoard, chamberTrimKit: v === true } })
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
                    onChange({ ...data, chamberBoard: { ...data.chamberBoard, chamberTrimColour: val as "Black" | "Stainless Steel" } })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </OptionalSection>
      )}
    </div>
  );
}
