import jsPDF from 'jspdf';
import { QuoteData } from '@/types/quote';
import { REEDED_PANELS_PRICE, CHAMBER_TRIM_KIT_PRICE } from '@/data/productCatalog';
import { EXTRAS_CONFIG } from '@/data/extrasConfig';
import { GAS_BF_PRODUCTS, GAS_CF_PRODUCTS } from '@/data/fireProductsByJobType';

interface LineItem {
  label: string;
  detail?: string;
  price: number;
}

function getLineItems(data: QuoteData): LineItem[] {
  const items: LineItem[] = [];

  if (data.products.fire.brand || data.products.fire.model) {
    items.push({
      label: 'Woodburner',
      detail: `${data.products.fire.brand} ${data.products.fire.model}`.trim(),
      price: data.products.fire.price,
    });
  }

  if (data.products.hearth.enabled) {
    if (data.products.hearth.description) {
      items.push({ label: 'Hearth', detail: data.products.hearth.description, price: data.products.hearth.price });
    }
    if (data.products.hearth.description2) {
      items.push({ label: 'Hearth (2nd)', detail: data.products.hearth.description2, price: data.products.hearth.price2 });
    }
  }
  if (data.products.beam.enabled) {
    items.push({ label: 'Beam', detail: data.products.beam.material, price: data.products.beam.price });
  }
  if (data.products.surround.enabled) {
    items.push({ label: 'Surround', detail: data.products.surround.description, price: data.products.surround.price });
  }

  if (data.products.chamberBoard.enabled) {
    if (data.products.chamberBoard.boardName) {
      items.push({
        label: 'Chamber Board',
        detail: data.products.chamberBoard.boardName,
        price: data.products.chamberBoard.boardPrice,
      });
    }
    if (data.products.chamberBoard.reededPanels) {
      items.push({ label: 'Cast Reeded Infill Panels', price: REEDED_PANELS_PRICE });
    }
    if (data.products.chamberBoard.chamberTrimKit) {
      items.push({
        label: 'Chamber Trim Kit',
        detail: data.products.chamberBoard.chamberTrimColour,
        price: CHAMBER_TRIM_KIT_PRICE,
      });
    }
  }

  if (data.products.gasFirebox) {
    items.push({ label: 'Gas Firebox', price: 250 });
  }

  if (data.products.gasFireLining) {
    const allProducts = [...GAS_BF_PRODUCTS, ...GAS_CF_PRODUCTS];
    const selectedProduct = allProducts.find((p) => p.name === data.products.fire.model);
    if (selectedProduct?.linings) {
      const lining = selectedProduct.linings.find((l) => l.name === data.products.gasFireLining);
      if (lining && lining.priceExVat > 0) {
        items.push({ label: 'Lining Upgrade', detail: lining.name, price: lining.priceExVat });
      }
    }
  }

  if (data.products.gasFireFrame) {
    const allProducts = [...GAS_BF_PRODUCTS, ...GAS_CF_PRODUCTS];
    const selectedProduct = allProducts.find((p) => p.name === data.products.fire.model);
    if (selectedProduct?.frames) {
      const framePrice = selectedProduct.frames[data.products.gasFireFrame];
      if (framePrice !== undefined && framePrice > 0) {
        items.push({ label: 'Frame Upgrade', detail: data.products.gasFireFrame, price: framePrice });
      }
    }
  }

  if (data.products.gasFireTrim) {
    const t = data.products.gasFireTrim;
    if (t.pairedTrimName !== undefined) {
      items.push({ label: 'Fret', detail: t.name, price: t.priceExVat });
      if (t.pairedTrimName && t.pairedTrimPrice) {
        items.push({ label: 'Standard Trim', detail: t.pairedTrimName, price: t.pairedTrimPrice });
      }
    } else {
      items.push({ label: 'Fascia', detail: t.name, price: t.priceExVat });
    }
  }

  if (data.products.gasFireGatherHood?.enabled) {
    items.push({ label: 'Gather Hood', price: data.products.gasFireGatherHood.priceExVat });
  }

  if (data.products.cjFireplace) {
    items.push({
      label: 'C&J Fireplace',
      detail: data.products.cjFireplace.name,
      price: data.products.cjFireplace.priceExVat,
    });
  }

  if (data.jobType === 'Gas Stove') {
    data.products.bfFittings
      .filter((f) => f.enabled)
      .forEach((f) => {
        items.push({ label: f.label, price: f.price });
      });
  }

  if (data.jobType === 'Electric Fire / Media Wall' && data.products.electricStyle === 'Media Wall') {
    const mw = data.products.mediaWallItems;
    if (mw.clsTimberQty > 0) items.push({ label: 'CLS Timber', detail: `${mw.clsTimberQty} lengths`, price: mw.clsTimberQty });
    if (mw.plasterboardQty > 0) items.push({ label: 'Plasterboard', detail: `${mw.plasterboardQty} sheets`, price: mw.plasterboardQty });
    if (mw.cornerBeadQty > 0) items.push({ label: 'Corner Bead', detail: `${mw.cornerBeadQty} lengths`, price: mw.cornerBeadQty });
    if (mw.tvBracket) items.push({ label: 'TV Bracket', price: 150 });
    if (mw.plastered) items.push({ label: 'Plastered', price: 450 });
    if (mw.electricSockets) items.push({ label: 'Electric (2x double sockets only)', price: 275 });
  }

  const isWoodburnerJob = data.jobType === 'Woodburner — Chimney Liner' || data.jobType === 'Woodburner — Twin Wall';
  data.extras.forEach((e, i) => {
    if (!e.enabled) return;
    const cfg = EXTRAS_CONFIG[i];
    if (cfg?.woodburnerOnly && !isWoodburnerJob) return;
    items.push({ label: e.label, price: e.price });
  });

  const isGasCFLiner =
    data.jobType === 'Gas Fire — Inset (Conventional Flue)' ||
    (data.jobType === 'Gas Stove' && (data.products.fire.model.includes('Conventional Flue') || data.products.fire.model.includes(' CF ')));

  if (data.jobType === 'Woodburner — Twin Wall' && data.twinWallKit.price > 0) {
    let twPrice = data.twinWallKit.price;
    if (data.twinWallKit.flueSize === '6"') {
      twPrice *= 1.2;
    }
    items.push({
      label: 'Twin Wall Flue Kit',
      detail: `${data.twinWallKit.kitType} · ${data.twinWallKit.flueSize} · ${data.twinWallKit.system} · ${data.twinWallKit.colour}${data.twinWallKit.flueSize === '6"' ? ' (6" +20%)' : ''}`,
      price: Math.round(twPrice * 100) / 100,
    });
    if (data.twinWallKit.additionalItemDescription.trim()) {
      items.push({
        label: data.twinWallKit.additionalItemDescription,
        price: data.twinWallKit.additionalItemPrice,
      });
    }
  } else if ((data.jobType === 'Woodburner — Chimney Liner' || isGasCFLiner) && data.linerKit.price > 0) {
    let linerPrice = data.linerKit.price;
    const surcharges: string[] = [];
    if (data.linerKit.flueSize === '6"') {
      linerPrice *= 1.2;
      surcharges.push('6" +20%');
    }
    if (data.linerKit.grade === '904L') {
      linerPrice *= 1.2;
      surcharges.push('904L +20%');
    }
    const surchargeNote = surcharges.length ? ` (${surcharges.join(', ')})` : '';
    items.push({
      label: 'Liner Kit',
      detail: `${data.linerKit.kitType} · ${data.linerKit.flueSize} · ${data.linerKit.system} · ${data.linerKit.grade}${surchargeNote}`,
      price: Math.round(linerPrice * 100) / 100,
    });
    if (data.linerKit.regPlateSize) {
      items.push({ label: `Reg Plate (${data.linerKit.regPlateSize})`, price: data.linerKit.regPlatePrice });
    }
    data.linerKit.accessories
      .filter((a) => a.enabled)
      .forEach((a) => {
        items.push({ label: a.label, price: a.price });
      });
  }

  if (data.labourDays > 0) {
    items.push({
      label: 'Labour',
      detail: `${data.labourDays} day${data.labourDays !== 1 ? 's' : ''} × £800/day`,
      price: data.labourDays * 800,
    });
  }

  return items;
}

export function generateQuotePDF(data: QuoteData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let yPosition = 20;

  // Header with logo + branding
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('No1 Fires', 20, yPosition);
  yPosition += 12;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('Quote', 20, yPosition);
  yPosition += 8;

  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // Customer details
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Customer Details', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`${data.customer.firstName} ${data.customer.lastName}`, 20, yPosition);
  yPosition += 6;
  doc.text(data.customer.email, 20, yPosition);
  yPosition += 6;
  doc.text(data.customer.phone, 20, yPosition);
  yPosition += 6;
  doc.text(data.customer.address, 20, yPosition);
  yPosition += 10;

  // Job Type
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Job Type', 20, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(data.jobType, 20, yPosition);
  yPosition += 10;

  // Line items breakdown
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Itemised Breakdown', 20, yPosition);
  yPosition += 8;

  const items = getLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  // Items table
  const itemYStart = yPosition;
  items.forEach((item) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont(undefined, 'normal');
    const label = item.detail ? `${item.label} (${item.detail})` : item.label;
    const lines = doc.splitTextToSize(label, pageWidth - 60);
    doc.text(lines, 20, yPosition);

    const labelHeight = lines.length * 4;
    doc.text(`£${item.price.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

    yPosition += labelHeight + 2;
  });

  yPosition += 5;
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;

  // Subtotal
  doc.setFont(undefined, 'normal');
  doc.text('Subtotal', 20, yPosition);
  doc.text(`£${subtotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 8;

  // VAT
  doc.text(`VAT (20%)${data.includeVat ? '' : ' (not included)'}`, 20, yPosition);
  doc.text(`£${vat.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 10;

  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 8;

  // Total (bold, large)
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL', 20, yPosition);
  doc.text(`£${total.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 12;

  // Payment terms
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Payment Terms', 20, yPosition);
  yPosition += 6;

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('45% deposit • 45% on materials arrival • 10% on completion', 20, yPosition);
  yPosition += 8;

  // Notes if present
  if (data.notes) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Notes', 20, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const noteLines = doc.splitTextToSize(data.notes, pageWidth - 40);
    doc.text(noteLines, 20, yPosition);
    yPosition += noteLines.length * 4 + 8;
  }

  // Footer
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('No1 Fires | no1fires.co.uk | Terms & Conditions enclosed', 20, pageHeight - 10);

  return doc.output('blob');
}

export function calculateTotalPrice(data: QuoteData): number {
  const items = getLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  return subtotal + vat;
}
