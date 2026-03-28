import { QuoteData } from "@/types/quote";
import { REEDED_PANELS_PRICE, CHAMBER_TRIM_KIT_PRICE } from "@/data/productCatalog";
import { EXTRAS_CONFIG } from "@/data/extrasConfig";
import { GAS_BF_PRODUCTS, GAS_CF_PRODUCTS } from "@/data/fireProductsByJobType";

export interface LineItem {
  label: string;
  detail?: string;
  price: number;
}

export function getLineItems(data: QuoteData): LineItem[] {
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

  if (data.products.gasFirebox) {
    items.push({ label: "Gas Firebox", price: 250 });
  }

  if (data.products.gasFireLining) {
    const allProducts = [...GAS_BF_PRODUCTS, ...GAS_CF_PRODUCTS];
    const selectedProduct = allProducts.find((p) => p.name === data.products.fire.model);
    if (selectedProduct?.linings) {
      const lining = selectedProduct.linings.find((l) => l.name === data.products.gasFireLining);
      if (lining && lining.priceExVat > 0) {
        items.push({ label: "Lining Upgrade", detail: lining.name, price: lining.priceExVat });
      }
    }
  }

  if (data.products.gasFireFrame) {
    const allProducts = [...GAS_BF_PRODUCTS, ...GAS_CF_PRODUCTS];
    const selectedProduct = allProducts.find((p) => p.name === data.products.fire.model);
    if (selectedProduct?.frames) {
      const framePrice = selectedProduct.frames[data.products.gasFireFrame];
      if (framePrice !== undefined && framePrice > 0) {
        items.push({ label: "Frame Upgrade", detail: data.products.gasFireFrame, price: framePrice });
      }
    }
  }

  if (data.products.gasFireTrim) {
    const t = data.products.gasFireTrim;
    if (t.pairedTrimName !== undefined) {
      items.push({ label: "Fret", detail: t.name, price: t.priceExVat });
      if (t.pairedTrimName && t.pairedTrimPrice) {
        items.push({ label: "Standard Trim", detail: t.pairedTrimName, price: t.pairedTrimPrice });
      }
    } else {
      items.push({ label: "Fascia", detail: t.name, price: t.priceExVat });
    }
  }

  if (data.products.gasFireGatherHood?.enabled) {
    items.push({ label: "Gather Hood", price: data.products.gasFireGatherHood.priceExVat });
  }

  if (data.products.cjFireplace) {
    items.push({ label: "C&J Fireplace", detail: data.products.cjFireplace.name, price: data.products.cjFireplace.priceExVat });
  }

  if (data.jobType === "Gas Stove") {
    data.products.bfFittings.filter((f) => f.enabled).forEach((f) => {
      items.push({ label: f.label, price: f.price });
    });
  }

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
    if (cfg?.woodburnerOnly && !isWoodburnerJob) return;
    items.push({ label: e.label, price: e.price });
  });

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

  if (data.labourDays > 0) {
    items.push({
      label: "Labour",
      detail: `${data.labourDays} day${data.labourDays !== 1 ? "s" : ""} × £800/day`,
      price: data.labourDays * 800,
    });
  }

  return items;
}

/** Line items for the customer-facing proposal — excludes labour */
export function getProposalLineItems(data: QuoteData): LineItem[] {
  return getLineItems(data).filter(item => item.label !== "Labour");
}

/** Total for the customer-facing proposal (excludes labour, optionally includes VAT) */
export function getProposalTotal(data: QuoteData): number {
  const items = getProposalLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (data.includeVat ? 1.2 : 1);
}

export function formatCurrency(value: number) {
  return `£${value.toFixed(2)}`;
}
