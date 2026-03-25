import { Products, JobType, ElectricStyle, BfFitting, GasFireTrim } from "@/types/quote";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  WOODBURNER_PRODUCTS,
  GAS_BF_PRODUCTS,
  GAS_CF_PRODUCTS,
  GAS_STOVE_PRODUCTS,
  ELECTRIC_FIRE_TABS,
  GAS_FIRE_TRIMS,
  CJ_COMPATIBLE_FIREPLACES,
  CJ_16_INCH_FIRES,
  ONYX_ELECTRIC_PRODUCTS,
  ONYX_ELECTRIC_ADDONS,
  ONYX_CF_FRAME_OPTIONS,
  CJ_16_INCH_TRIM_OPTIONS,
} from "@/data/fireProductsByJobType";
import { calculateProductSubtotal } from "@/lib/subtotalCalculator";
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
//  BRAND HEADER — visual divider between manufacturer sections
// ─────────────────────────────────────────────
function BrandHeader({ brand }: { brand: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
        {brand}
      </span>
      <div className="flex-1 h-px bg-border" />
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
  const [programmableRemoteChecked, setProgrammableRemoteChecked] = React.useState(false);

  const productsInCat = products.filter((p) => p.subCategory === selectedSubCat);
  const selectedProduct = products.find((p) => p.name === data.fire.model);
  const hasControlOptions = selectedProduct && selectedProduct.price === undefined;
  const isGazcoNoTrim = selectedProduct?.noTrimOptions === true;
  const programmableRemotePrice = selectedProduct?.programmableRemoteUpgrade ?? 0;

  // Trim config for current model + control type
  const trimConfig = data.fire.model ? GAS_FIRE_TRIMS[data.fire.model]?.[controlType] : undefined;
  const hasFascias      = (trimConfig?.fascias.length ?? 0) > 0;
  const hasFrets        = (trimConfig?.frets.length ?? 0) > 0;
  const hasStandardTrims = (trimConfig?.standardTrims.length ?? 0) > 0;
  const hasTrimSection  = hasFascias || hasFrets;

  // C&J compatible fireplaces
  const cjFireplaceOptions = data.fire.model ? CJ_COMPATIBLE_FIREPLACES[data.fire.model] : undefined;

  // Large format toggle: trim/fascia vs C&J fireplace package (mutually exclusive)
  const isLargeFormat = !!(cjFireplaceOptions && cjFireplaceOptions.length > 0);
  const [largeFormatMode, setLargeFormatMode] = React.useState<"trim" | "cj">("trim");

  const handleLargeFormatModeChange = (mode: "trim" | "cj") => {
    setLargeFormatMode(mode);
    if (mode === "trim") {
      // Clear C&J fireplace selection
      onChange({ ...data, cjFireplace: null });
    } else {
      // Clear trim selection when switching to C&J
      onChange({ ...data, gasFireTrim: null, cjFireplace: null });
    }
  };

  const handleProductSelect = (productName: string) => {
    const item = productsInCat.find((p) => p.name === productName);
    if (!item) return;
    let basePrice = 0;
    if (item.price !== undefined) {
      basePrice = item.price;
    } else {
      basePrice = controlType === "remote" && item.remoteControlNg !== undefined
        ? item.remoteControlNg
        : item.slideControlNg || 0;
    }
    setProgrammableRemoteChecked(false);
    onChange({
      ...data,
      fire: { brand: item.brand ?? "C&J", model: item.name, kw: "", price: basePrice },
      gasFireTrim: null,
      gasFireGatherHood: { enabled: false, priceExVat: 0 },
      cjFireplace: null,
    });
  };

  const handleControlChange = (ct: "slide" | "remote") => {
    setControlType(ct);
    const item = products.find((p) => p.name === data.fire.model);
    if (item && item.price === undefined) {
      const basePrice = ct === "remote" && item.remoteControlNg !== undefined
        ? item.remoteControlNg
        : item.slideControlNg || 0;
      const extraPrice = programmableRemoteChecked ? (item.programmableRemoteUpgrade ?? 0) : 0;
      onChange({ ...data, fire: { ...data.fire, price: basePrice + extraPrice }, gasFireTrim: null });
    } else {
      onChange({ ...data, gasFireTrim: null });
    }
  };

  const handleProgrammableRemoteChange = (checked: boolean) => {
    setProgrammableRemoteChecked(checked);
    const item = products.find((p) => p.name === data.fire.model);
    if (item && item.price !== undefined) {
      const extraPrice = checked ? (item.programmableRemoteUpgrade ?? 0) : 0;
      onChange({ ...data, fire: { ...data.fire, price: item.price + extraPrice } });
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
              {(() => {
                // Group products by Manufacturer → Type/Series → Model (3-level hierarchy)
                const manufacturerMap = new Map<string, Map<string, typeof productsInCat>>();
                
                for (const p of productsInCat) {
                  const manufacturer = p.brand ?? "Charlton & Jenrick";
                  if (!manufacturerMap.has(manufacturer)) {
                    manufacturerMap.set(manufacturer, new Map());
                  }
                  
                  // Use typeCategory if available, otherwise fall back to subCategory
                  const typeCategory = p.typeCategory || p.subCategory || manufacturer;
                  const typeMap = manufacturerMap.get(manufacturer)!;
                  
                  if (!typeMap.has(typeCategory)) {
                    typeMap.set(typeCategory, []);
                  }
                  typeMap.get(typeCategory)!.push(p);
                }

                // Render: Manufacturer → Type/Series → Models
                return Array.from(manufacturerMap.entries()).map(([manufacturer, typeMap]) => (
                  <React.Fragment key={manufacturer}>
                    {Array.from(typeMap.entries()).map(([typeCategory, items]) => {
                      const multipleTypes = typeMap.size > 1;
                      return (
                        <SelectGroup key={`${manufacturer}-${typeCategory}`}>
                          <SelectLabel className="font-bold text-foreground">
                            {multipleTypes ? `${manufacturer} — ${typeCategory}` : manufacturer}
                          </SelectLabel>
                          {items.map((p) => (
                            <SelectItem key={p.name} value={p.name}>
                              {p.name}{p.description ? ` — ${p.description}` : ""}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </React.Fragment>
                ));
              })()}
            </SelectContent>
          </Select>
        </div>

        {data.fire.model && hasControlOptions && !isGazcoNoTrim && (
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

        {/* ── Programmable Thermostatic Remote upgrade for Riva2 (no control toggle, fixed price base) ── */}
        {data.fire.model && selectedProduct?.programmableRemoteUpgrade !== undefined && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Checkbox
                id="programmable-remote"
                checked={programmableRemoteChecked}
                onCheckedChange={handleProgrammableRemoteChange}
              />
              <Label htmlFor="programmable-remote" className="text-xs cursor-pointer">
                Programmable Thermostatic Remote (+£{selectedProduct.programmableRemoteUpgrade.toFixed(2)} ex VAT)
              </Label>
            </div>
          </div>
        )}

        <div>
          <Label className="text-xs">Price ex VAT</Label>
          <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
        </div>
      </div>

      {/* ── Gazco Lining Selector ── */}
      {data.fire.model && selectedProduct?.linings && selectedProduct.linings.length > 0 && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border-t-2 border-blue-300/30">
          <Label className="text-sm font-semibold">Lining Finish (optional)</Label>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Choose a finish</Label>
            <Select
              value={data.gasFireLining || "__none__"}
              onValueChange={(val) => {
                if (val === "__none__") {
                  onChange({ ...data, gasFireLining: undefined });
                } else {
                  const lining = selectedProduct.linings!.find((l) => l.name === val);
                  if (lining) {
                    onChange({ ...data, gasFireLining: lining.name });
                  }
                }
              }}
            >
              <SelectTrigger><SelectValue placeholder="Choose lining" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Black Reeded (no upgrade)</SelectItem>
                {selectedProduct.linings!.map((l) => (
                  <SelectItem key={l.name} value={l.name}>
                    {l.name}{l.priceExVat > 0 ? ` — +£${l.priceExVat.toFixed(2)}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* ── Gazco Frame Selector ── */}
      {data.fire.model && selectedProduct?.frames && Object.keys(selectedProduct.frames).length > 0 && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border-t-2 border-green-300/30">
          <Label className="text-sm font-semibold">Frame Style (optional)</Label>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Choose a frame</Label>
            <Select
              value={data.gasFireFrame || "__none__"}
              onValueChange={(val) => {
                if (val === "__none__") {
                  onChange({ ...data, gasFireFrame: undefined });
                } else {
                  onChange({ ...data, gasFireFrame: val });
                }
              }}
            >
              <SelectTrigger><SelectValue placeholder="Choose frame" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Edge (no upgrade)</SelectItem>
                {Object.entries(selectedProduct.frames!).map(([name, price]) => (
                  <SelectItem key={name} value={name}>
                    {name}{price > 0 ? ` — +£${price.toFixed(2)}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* ── Large Format: Trim/Fascia OR C&J Fireplace Package toggle ── */}
      {data.fire.model && isLargeFormat && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border-t-2 border-primary/30">
          <Label className="text-sm font-semibold">Fireplace Finishing Option</Label>
          <p className="text-xs text-muted-foreground">Choose one — trim/fascia and C&J fireplace package are mutually exclusive</p>
          <RadioGroup
            value={largeFormatMode}
            onValueChange={(v) => handleLargeFormatModeChange(v as "trim" | "cj")}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="trim" id="lf-mode-trim" />
              <Label htmlFor="lf-mode-trim" className="text-sm cursor-pointer font-medium">Trim &amp; Fascia</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="cj" id="lf-mode-cj" />
              <Label htmlFor="lf-mode-cj" className="text-sm cursor-pointer font-medium">C&amp;J Fireplace Package</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* ── Trim / Fascia selector — hidden when large format C&J mode is active OR for Gazco products ── */}
      {data.fire.model && hasTrimSection && (!isLargeFormat || largeFormatMode === "trim") && !isGazcoNoTrim && (
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
                      onChange({
                        ...data,
                        gasFireTrim: {
                          name: fret.name,
                          priceExVat: fret.priceExVat,
                          pairedTrimName: "",
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

      {/* ── Onyx Optional Frame — shown when an Onyx CF fire is selected ── */}
      {data.fire.brand === "Onyx" && title.includes("CF") && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border-t-2 border-orange-400/30">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 px-1">Onyx</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <Label className="text-sm font-semibold">Optional Frame (Onyx CF)</Label>
          <Select
            value={data.gasFireTrim?.name ?? "__none__"}
            onValueChange={(val) => {
              if (val === "__none__") {
                onChange({ ...data, gasFireTrim: null });
              } else {
                const item = ONYX_CF_FRAME_OPTIONS.find((f) => f.name === val);
                if (item) {
                  // Store as ex-VAT (divide by 1.2)
                  onChange({ ...data, gasFireTrim: { name: item.name, priceExVat: item.priceIncVat / 1.2 } });
                }
              }
            }}
          >
            <SelectTrigger><SelectValue placeholder="No frame" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No frame</SelectItem>
              {ONYX_CF_FRAME_OPTIONS.map((f) => (
                <SelectItem key={f.name} value={f.name}>
                  {f.name} — £{f.priceIncVat} inc VAT
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── C&J Limestone Fireplace Package — large format only, shown when C&J mode active ── */}
      {data.fire.model && isLargeFormat && largeFormatMode === "cj" && cjFireplaceOptions && cjFireplaceOptions.length > 0 && (
        <div className="bg-card rounded-lg p-4 shadow-sm space-y-3 border-t-2 border-primary/20">
          <Label className="text-sm font-semibold">C&amp;J Portuguese Limestone Fireplace Package</Label>
          <p className="text-xs text-muted-foreground">Includes surround, hearth &amp; back panel — replaces Capital surround</p>
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
            <SelectTrigger><SelectValue placeholder="Choose fireplace package" /></SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="__none__">No C&amp;J fireplace</SelectItem>
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
  // Group stove products by brand
  const brandMap = new Map<string, typeof GAS_STOVE_PRODUCTS>();
  for (const p of GAS_STOVE_PRODUCTS) {
    const b = p.brand ?? "Charlton & Jenrick";
    if (!brandMap.has(b)) brandMap.set(b, []);
    brandMap.get(b)!.push(p);
  }
  const stoveBrandGroups = Array.from(brandMap.entries());

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
                onChange({ ...data, fire: { brand: item.brand ?? "C&J", model: item.name, kw: "", price: item.priceExVat } });
              }
            }}
          >
            <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
            <SelectContent>
              {stoveBrandGroups.length === 1
                ? stoveBrandGroups[0][1].map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name} ({p.fuel}) — £{p.priceExVat.toFixed(2)}
                    </SelectItem>
                  ))
                : stoveBrandGroups.map(([brand, items]) => (
                    <SelectGroup key={brand}>
                      <SelectLabel className="font-bold text-foreground">{brand}</SelectLabel>
                      {items.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.name} ({p.fuel}) — £{p.priceExVat.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))
              }
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
  const [onyxAddonIds, setOnyxAddonIds] = React.useState<string[]>([]);

  const currentTab = ELECTRIC_FIRE_TABS.find((t) => t.tabName === activeTab) || ELECTRIC_FIRE_TABS[0];

  // Derive unique Onyx series for grouped display
  const onyxSeries = [...new Set(ONYX_ELECTRIC_PRODUCTS.map((p) => p.series))];

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

  const handleOnyxProductSelect = (name: string) => {
    const item = ONYX_ELECTRIC_PRODUCTS.find((p) => p.name === name);
    if (!item) return;
    // Store inc-VAT price as-is; convert to ex-VAT for the quote system
    const priceExVat = item.priceIncVat / 1.2;
    onChange({ ...data, fire: { brand: "Onyx", model: item.name, kw: "", price: priceExVat } });
    setOnyxAddonIds([]);
  };

  const recalcOnyxAddonPrice = (baseProductName: string, addonIds: string[]) => {
    const item = ONYX_ELECTRIC_PRODUCTS.find((p) => p.name === baseProductName);
    if (!item) return;
    let extra = 0;
    for (const id of addonIds) {
      const addon = ONYX_ELECTRIC_ADDONS.find((a) => a.id === id);
      if (addon?.priceIncVat) extra += addon.priceIncVat / 1.2;
    }
    onChange({ ...data, fire: { ...data.fire, price: item.priceIncVat / 1.2 + extra } });
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
                onChange({ ...data, fire: { brand: "C&J", model: item.name, kw: "", price: item.priceExVat }, gasFireTrim: null });
              }
            }}
          >
            <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {/* Group by type */}
              {(() => {
                const groups: Record<string, typeof CJ_16_INCH_FIRES> = {
                  "3D Ecoflame 16\"": [],
                  "4D Ecoflame 16\"": [],
                  "4D Ecoflame 22\" Maxi": [],
                  "Opulus 16\" RFT": [],
                  "Electric Stoves": [],
                };
                for (const p of CJ_16_INCH_FIRES) {
                  if (p.name.startsWith("3D Ecoflame 16")) groups["3D Ecoflame 16\""].push(p);
                  else if (p.name.startsWith("4D Ecoflame 22")) groups["4D Ecoflame 22\" Maxi"].push(p);
                  else if (p.name.startsWith("4D Ecoflame 16")) groups["4D Ecoflame 16\""].push(p);
                  else if (p.name.startsWith("Opulus")) groups["Opulus 16\" RFT"].push(p);
                  else groups["Electric Stoves"].push(p);
                }
                return Object.entries(groups).map(([groupName, items]) =>
                  items.length === 0 ? null : (
                    <SelectGroup key={groupName}>
                      <SelectLabel className="font-bold text-foreground">{groupName}</SelectLabel>
                      {items.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.name} — £{p.priceExVat.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )
                );
              })()}
            </SelectContent>
          </Select>
          {data.fire.model && (() => {
            const item = CJ_16_INCH_FIRES.find((p) => p.name === data.fire.model);
            return item ? <p className="text-xs text-muted-foreground">{item.description}</p> : null;
          })()}

          {/* Optional standalone trim — shown when an engine-only product is selected */}
          {data.fire.model && (data.fire.model.includes("Engine Only") || data.fire.model.includes("Engine only")) && (
            <div className="pt-2 border-t border-border space-y-2">
              <Label className="text-xs font-semibold">Optional Trim / Fascia (engine-only)</Label>
              <p className="text-xs text-muted-foreground">Add a boxed trim, Prestige fascia, or decorative fret</p>
              <Select
                value={data.gasFireTrim?.name ?? "__none__"}
                onValueChange={(val) => {
                  if (val === "__none__") {
                    onChange({ ...data, gasFireTrim: null });
                  } else {
                    const item = CJ_16_INCH_TRIM_OPTIONS.find((t) => t.name === val);
                    if (item) onChange({ ...data, gasFireTrim: { name: item.name, priceExVat: item.priceExVat } });
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="No trim / fascia" /></SelectTrigger>
                <SelectContent className="max-h-[280px] overflow-y-auto">
                  <SelectItem value="__none__">No trim / fascia</SelectItem>
                  {(["Boxed Trim", "Prestige Fascia", "Fret"] as const).map((cat) => {
                    const items = CJ_16_INCH_TRIM_OPTIONS.filter((t) => t.category === cat);
                    return (
                      <SelectGroup key={cat}>
                        <SelectLabel>{cat}</SelectLabel>
                        {items.map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.name} — £{t.priceExVat.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    );
                  })}
                </SelectContent>
              </Select>
              {data.gasFireTrim && (
                <p className="text-xs text-muted-foreground">
                  Selected: {data.gasFireTrim.name} — £{data.gasFireTrim.priceExVat.toFixed(2)} ex VAT
                </p>
              )}
            </div>
          )}

          <div>
            <Label className="text-xs">Price ex VAT</Label>
            <PriceInput value={data.fire.price} onChange={(v) => onChange({ ...data, fire: { ...data.fire, price: v } })} />
          </div>
        </div>
      )}

      {/* Fire product selector — iRange / Luminosa / Onyx (not shown for 16 inch style) */}
      {data.electricStyle !== "16 Inch Fire with Fireplace" && (
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <Label className="text-sm font-semibold">Electric Fire *</Label>
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val);
            setRealLogsChecked(false);
            setWoodLogSetChecked(false);
            setOnyxAddonIds([]);
            onChange({ ...data, fire: { brand: "", model: "", kw: "", price: 0 } });
          }}
        >
          <TabsList className="w-full grid grid-cols-4">
            {ELECTRIC_FIRE_TABS.map((t) => (
              <TabsTrigger key={t.tabName} value={t.tabName} className="text-xs">{t.tabName}</TabsTrigger>
            ))}
            <TabsTrigger value="Onyx" className="text-xs font-semibold">Onyx</TabsTrigger>
          </TabsList>

          {/* ── C&J iRange / Luminosa tabs ── */}
          {ELECTRIC_FIRE_TABS.map((tab) => (
            <TabsContent key={tab.tabName} value={tab.tabName} className="space-y-3">
              {/* C&J brand header */}
              <BrandHeader brand="Charlton & Jenrick" />
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

          {/* ── Onyx Electric tab ── */}
          <TabsContent value="Onyx" className="space-y-3">
            <BrandHeader brand="Onyx" />
            <p className="text-xs text-muted-foreground">All Onyx prices shown inc VAT</p>
            <div>
              <Label className="text-xs">Model</Label>
              <Select
                value={data.fire.brand === "Onyx" ? data.fire.model : undefined}
                onValueChange={handleOnyxProductSelect}
              >
                <SelectTrigger><SelectValue placeholder="Choose model" /></SelectTrigger>
                <SelectContent className="max-h-[340px] overflow-y-auto">
                  {onyxSeries.map((series) => (
                    <SelectGroup key={series}>
                      <SelectLabel className="font-semibold text-foreground">{series}</SelectLabel>
                      {ONYX_ELECTRIC_PRODUCTS.filter((p) => p.series === series).map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          {p.name} — £{p.priceIncVat.toLocaleString()} inc VAT
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Onyx optional add-ons */}
            {data.fire.brand === "Onyx" && data.fire.model && (
              <div className="space-y-2 pt-1 border-t border-border">
                <Label className="text-xs font-semibold">Optional Add-ons</Label>
                {ONYX_ELECTRIC_ADDONS.map((addon) => (
                  <div key={addon.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`onyx-addon-${addon.id}`}
                      checked={onyxAddonIds.includes(addon.id)}
                      onCheckedChange={(v) => {
                        const next = v === true
                          ? [...onyxAddonIds, addon.id]
                          : onyxAddonIds.filter((id) => id !== addon.id);
                        setOnyxAddonIds(next);
                        recalcOnyxAddonPrice(data.fire.model, next);
                      }}
                    />
                    <Label htmlFor={`onyx-addon-${addon.id}`} className="text-xs cursor-pointer">
                      {addon.label}
                      {addon.priceIncVat != null ? ` — +£${addon.priceIncVat} inc VAT` : " (price on request)"}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
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
//  MAIN StepFire component (renamed from StepProducts)
// ─────────────────────────────────────────────
export function StepFire({ data, jobType, onChange }: Props) {
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

      {/* Subtotal for Fire Section */}
      <div className="bg-card rounded-lg p-4 shadow-sm border-t-2 border-primary mt-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-foreground">Subtotal (Fire):</span>
          <span className="text-lg font-bold text-primary">
            £{calculateProductSubtotal(data, jobType as string).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
