import { QuoteData } from "@/types/quote";
import { REEDED_PANELS_PRICE, CHAMBER_TRIM_KIT_PRICE } from "@/data/productCatalog";
import { EXTRAS_CONFIG } from "@/data/extrasConfig";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, Send } from "lucide-react";

interface Props {
  data: QuoteData;
  onToggleVat: (v: boolean) => void;
}

interface LineItem {
  label: string;
  detail?: string;
  price: number;
}

function getLineItems(data: QuoteData): LineItem[] {
  const items: LineItem[] = [];

  if (data.products.fire.brand || data.products.fire.model) {
    items.push({
      label: "Woodburner",
      detail: `${data.products.fire.brand} ${data.products.fire.model}`.trim(),
      price: data.products.fire.price,
    });
  }

  if (data.products.hearth.enabled) {
    if (data.products.hearth.description) {
      items.push({ label: "Hearth", detail: data.products.hearth.description, price: data.products.hearth.price });
    }
    if (data.products.hearth.description2) {
      items.push({ label: "Hearth (2nd)", detail: data.products.hearth.description2, price: data.products.hearth.price2 });
    }
  }
  if (data.products.beam.enabled) {
    items.push({ label: "Beam", detail: data.products.beam.material, price: data.products.beam.price });
  }
  if (data.products.surround.enabled) {
    items.push({ label: "Surround", detail: data.products.surround.description, price: data.products.surround.price });
  }

  if (data.products.chamberBoard.enabled) {
    if (data.products.chamberBoard.boardName) {
      items.push({ label: "Chamber Board", detail: data.products.chamberBoard.boardName, price: data.products.chamberBoard.boardPrice });
    }
    if (data.products.chamberBoard.reededPanels) {
      items.push({ label: "Cast Reeded Infill Panels", price: REEDED_PANELS_PRICE });
    }
    if (data.products.chamberBoard.chamberTrimKit) {
      items.push({ label: "Chamber Trim Kit", detail: data.products.chamberBoard.chamberTrimColour, price: CHAMBER_TRIM_KIT_PRICE });
    }
  }

  // Gas Firebox (CF only)
  if (data.products.gasFirebox) {
    items.push({ label: "Gas Firebox", price: 250 });
  }

  // Gas Fire Trim / Fascia
  if (data.products.gasFireTrim) {
    const t = data.products.gasFireTrim;
    if (t.pairedTrimName !== undefined) {
      // Fret + standard trim combo
      items.push({ label: "Fret", detail: t.name, price: t.priceExVat });
      if (t.pairedTrimName && t.pairedTrimPrice) {
        items.push({ label: "Standard Trim", detail: t.pairedTrimName, price: t.pairedTrimPrice });
      }
    } else {
      items.push({ label: "Fascia", detail: t.name, price: t.priceExVat });
    }
  }

  // Gather Hood
  if (data.products.gasFireGatherHood?.enabled) {
    items.push({ label: "Gather Hood", price: data.products.gasFireGatherHood.priceExVat });
  }

  // C&J Compatible Fireplace
  if (data.products.cjFireplace) {
    items.push({ label: "C&J Fireplace", detail: data.products.cjFireplace.name, price: data.products.cjFireplace.priceExVat });
  }

  // BF Fittings (Gas Stove BF)
  if (data.jobType === "Gas Stove") {
    data.products.bfFittings.filter((f) => f.enabled).forEach((f) => {
      items.push({ label: f.label, price: f.price });
    });
  }

  // Media Wall items (Electric)
  if (data.jobType === "Electric Fire / Media Wall" && data.products.electricStyle === "Media Wall") {
    const mw = data.products.mediaWallItems;
    if (mw.clsTimberQty > 0) items.push({ label: "CLS Timber", detail: `${mw.clsTimberQty} lengths`, price: mw.clsTimberQty });
    if (mw.plasterboardQty > 0) items.push({ label: "Plasterboard", detail: `${mw.plasterboardQty} sheets`, price: mw.plasterboardQty });
    if (mw.cornerBeadQty > 0) items.push({ label: "Corner Bead", detail: `${mw.cornerBeadQty} lengths`, price: mw.cornerBeadQty });
    if (mw.tvBracket) items.push({ label: "TV Bracket", price: 150 });
    if (mw.plastered) items.push({ label: "Plastered", price: 450 });
    if (mw.electricSockets) items.push({ label: "Electric (2x double sockets only)", price: 275 });
  }

  const isWoodburnerJob = data.jobType === "Woodburner — Chimney Liner" || data.jobType === "Woodburner — Twin Wall";
  data.extras.forEach((e, i) => {
    if (!e.enabled) return;
    const cfg = EXTRAS_CONFIG[i];
    // Never show woodburner-only extras on non-woodburner jobs
    if (cfg?.woodburnerOnly && !isWoodburnerJob) return;
    items.push({ label: e.label, price: e.price });
  });

  // Liner kit for Gas CF and Gas Stove CF variants
  const isGasCFLiner =
    data.jobType === "Gas Fire — Inset (Conventional Flue)" ||
    (data.jobType === "Gas Stove" && (
      data.products.fire.model.includes("Conventional Flue") || data.products.fire.model.includes(" CF ")
    ));

  if (data.jobType === "Woodburner — Twin Wall" && data.twinWallKit.price > 0) {
    let twPrice = data.twinWallKit.price;
    if (data.twinWallKit.flueSize === '6"') {
      twPrice *= 1.2;
    }
    items.push({
      label: "Twin Wall Flue Kit",
      detail: `${data.twinWallKit.kitType} · ${data.twinWallKit.flueSize} · ${data.twinWallKit.system} · ${data.twinWallKit.colour}${data.twinWallKit.flueSize === '6"' ? ' (6" +20%)' : ''}`,
      price: Math.round(twPrice * 100) / 100,
    });
    if (data.twinWallKit.additionalItemDescription.trim()) {
      items.push({
        label: data.twinWallKit.additionalItemDescription,
        price: data.twinWallKit.additionalItemPrice,
      });
    }
  } else if ((data.jobType === "Woodburner — Chimney Liner" || isGasCFLiner) && data.linerKit.price > 0) {
    let linerPrice = data.linerKit.price;
    const surcharges: string[] = [];
    if (data.linerKit.flueSize === '6"') {
      linerPrice *= 1.2;
      surcharges.push('6" +20%');
    }
    if (data.linerKit.grade === "904L") {
      linerPrice *= 1.2;
      surcharges.push("904L +20%");
    }
    const surchargeNote = surcharges.length ? ` (${surcharges.join(", ")})` : "";
    items.push({
      label: "Liner Kit",
      detail: `${data.linerKit.kitType} · ${data.linerKit.flueSize} · ${data.linerKit.system} · ${data.linerKit.grade}${surchargeNote}`,
      price: Math.round(linerPrice * 100) / 100,
    });
    if (data.linerKit.regPlateSize) {
      items.push({ label: `Reg Plate (${data.linerKit.regPlateSize})`, price: data.linerKit.regPlatePrice });
    }
    data.linerKit.accessories.filter((a) => a.enabled).forEach((a) => {
      items.push({ label: a.label, price: a.price });
    });
  }

  // Labour
  if (data.labourDays > 0) {
    items.push({
      label: "Labour",
      detail: `${data.labourDays} day${data.labourDays !== 1 ? "s" : ""} × £800/day`,
      price: data.labourDays * 800,
    });
  }

  return items;
}

function formatCurrency(value: number) {
  return `£${value.toFixed(2)}`;
}

export function StepSummary({ data, onToggleVat }: Props) {
  const items = getLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Customer */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <p className="text-xs text-muted-foreground mb-1">Customer</p>
        <p className="font-semibold text-sm">{data.customer.firstName} {data.customer.lastName}</p>
        <p className="text-xs text-muted-foreground">{data.customer.email} · {data.customer.phone}</p>
        <p className="text-xs text-muted-foreground">{data.customer.address}</p>
      </div>

      {/* Job Type */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <p className="text-xs text-muted-foreground mb-1">Job Type</p>
        <p className="font-semibold text-sm">{data.jobType}</p>
      </div>

      {/* Line items */}
      <div className="bg-card rounded-lg p-4 shadow-sm space-y-3">
        <p className="text-xs text-muted-foreground">Itemised Breakdown</p>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
            </div>
            <p className="text-sm font-semibold whitespace-nowrap">{formatCurrency(item.price)}</p>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-sm">VAT (20%)</Label>
            <Switch checked={data.includeVat} onCheckedChange={onToggleVat} />
          </div>
          <span className="text-sm font-semibold">{formatCurrency(vat)}</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment terms */}
      <div className="bg-accent/20 rounded-lg p-4">
        <p className="text-xs font-semibold text-accent-foreground mb-1">Payment Terms</p>
        <p className="text-xs text-accent-foreground">45% deposit · 45% on materials arrival · 10% on completion</p>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Notes</p>
          <p className="text-sm whitespace-pre-wrap">{data.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <Button variant="outline" className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          Preview Before Sending
        </Button>
        <Button className="w-full" size="lg">
          <Send className="w-4 h-4 mr-2" />
          Generate & Send Quote
        </Button>
      </div>
    </div>
  );
}
