import jsPDF from 'jspdf';
import { QuoteData } from '@/types/quote';

export function generateQuotePDF(data: QuoteData): Blob {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to safely add text
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
    doc.setFontSize(options.size || 10);
    doc.text(String(text).trim() || '', x, y);
  };

  // Header
  doc.setFillColor(192, 40, 28); // No1 Fires red
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  addText('No1 Fires', 20, 15, { size: 24, bold: true });
  doc.setTextColor(255, 255, 255);
  addText('Quote', 20, 22, { size: 12 });
  
  doc.setTextColor(0, 0, 0);
  yPosition = 40;

  // Job Details
  addText('SM8 Job Number: ' + (data.customer.jobNumber || 'N/A'), 20, yPosition, { bold: true });
  yPosition += 8;
  addText('Job Type: ' + (data.jobType || 'N/A'), 20, yPosition);
  yPosition += 12;

  // Line Items Header
  addText('ITEMISED BREAKDOWN', 20, yPosition, { bold: true, size: 11 });
  yPosition += 8;

  // Calculate items
  const items: Array<{ label: string; detail?: string; price: number }> = [];
  
  if (data.products.fire.brand || data.products.fire.model) {
    items.push({
      label: 'Fire/Stove',
      detail: `${data.products.fire.brand} ${data.products.fire.model}`.trim(),
      price: data.products.fire.price,
    });
  }

  if (data.products.hearth.enabled && data.products.hearth.description) {
    items.push({
      label: 'Hearth',
      detail: data.products.hearth.description,
      price: data.products.hearth.price,
    });
  }

  if (data.products.beam.enabled) {
    items.push({
      label: 'Beam',
      detail: data.products.beam.material,
      price: data.products.beam.price,
    });
  }

  if (data.products.surround.enabled) {
    items.push({
      label: 'Surround',
      detail: data.products.surround.description,
      price: data.products.surround.price,
    });
  }

  if (data.products.chamberBoard.enabled && data.products.chamberBoard.boardName) {
    items.push({
      label: 'Chamber Board',
      detail: data.products.chamberBoard.boardName,
      price: data.products.chamberBoard.boardPrice,
    });
  }

  if (data.products.gasFirebox) {
    items.push({
      label: 'Gas Firebox',
      price: 250,
    });
  }

  // Extras
  data.extras.forEach((e) => {
    if (e.enabled) {
      items.push({
        label: e.label,
        price: e.price,
      });
    }
  });

  // Labour
  if (data.labourDays > 0) {
    items.push({
      label: 'Labour',
      detail: `${data.labourDays} day(s) × £800/day`,
      price: data.labourDays * 800,
    });
  }

  // Print items
  const columnLabelX = 20;
  const columnDetailX = 80;
  const columnPriceX = 180;

  items.forEach((item) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    addText(item.label, columnLabelX, yPosition, { size: 9 });
    if (item.detail) {
      addText(`(${item.detail})`, columnDetailX, yPosition, { size: 8 });
    }
    addText(`£${item.price.toFixed(2)}`, columnPriceX, yPosition, { size: 9, bold: true });
    yPosition += 6;
  });

  yPosition += 4;

  // Totals
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;

  addText('─'.repeat(60), 20, yPosition);
  yPosition += 6;

  addText('Subtotal', columnLabelX, yPosition);
  addText(`£${subtotal.toFixed(2)}`, columnPriceX, yPosition, { bold: true });
  yPosition += 6;

  if (data.includeVat) {
    addText('VAT (20%)', columnLabelX, yPosition);
    addText(`£${vat.toFixed(2)}`, columnPriceX, yPosition, { bold: true });
    yPosition += 6;
  }

  addText('─'.repeat(60), 20, yPosition);
  yPosition += 6;

  addText('TOTAL', columnLabelX, yPosition, { bold: true, size: 12 });
  addText(`£${total.toFixed(2)}`, columnPriceX, yPosition, { bold: true, size: 12 });
  yPosition += 10;

  // Payment Terms
  addText('Payment Terms:', 20, yPosition, { bold: true });
  yPosition += 5;
  addText('45% deposit · 45% on materials arrival · 10% on completion', 20, yPosition, { size: 9 });
  yPosition += 8;

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  addText('No1 Fires | no1fires.co.uk', 20, pageHeight - 10, { size: 8 });

  return doc.output('blob');
}
