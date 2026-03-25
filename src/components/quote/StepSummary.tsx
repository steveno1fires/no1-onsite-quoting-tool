import { QuoteData } from "@/types/quote";
import { REEDED_PANELS_PRICE, CHAMBER_TRIM_KIT_PRICE, FERMACELL_BOARD_PRICE } from "@/data/productCatalog";
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
      label: "Fire / Appliance",
      detail: `${data.products.fire.brand} ${data.products.fire.model}`.trim(),
      price: data.products.fire.price,
    });
  }

  if (data.products.hearth.enabled) {
    items.push({ label: "Hearth", detail: data.products.hearth.description, price: data.products.hearth.price });
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

  data.extras.filter((e) => e.enabled).forEach((e) => {
    items.push({ label: e.label, price: e.price });
  });

  if (data.jobType === "Woodburner—Twin Wall" && data.twinWallKit.price > 0) {
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
  } else if (data.jobType === "Woodburner—Chimney Liner" && data.linerKit.price > 0) {
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
