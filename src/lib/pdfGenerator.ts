import jsPDF from 'jspdf';
import { QuoteData } from '@/types/quote';
import logoImage from '@/assets/logo.jpeg';

export function generateQuotePDF(data: QuoteData): Blob {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Add logo
  try {
    doc.addImage(logoImage, 'JPEG', 15, 10, 30, 15);
  } catch (e) {
    console.warn('Logo image failed to load');
  }

  // Header - No1 Fires branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(192, 40, 28); // Red
  doc.text('NO1 FIRES', 50, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('QUOTE', 50, 26);

  // Business details
  yPosition = 50;
  doc.setFontSize(9);
  doc.text('No1 Fires Ltd', 15, yPosition);
  yPosition += 5;
  doc.text('Ringwood, Hampshire', 15, yPosition);
  yPosition += 5;
  doc.text('Phone: 01425 xxx xxx', 15, yPosition);
  yPosition += 5;
  doc.text('Email: info@no1fires.co.uk', 15, yPosition);
  yPosition += 5;
  doc.text('Website: no1fires.co.uk', 15, yPosition);
  yPosition += 15;

  // Quote details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Quote Details:', 15, yPosition);
  yPosition += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`SM8 Job: ${data.customer.jobNumber || 'N/A'}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Job Type: ${data.jobType || 'N/A'}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, yPosition);
  yPosition += 12;

  // Items table header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setFillColor(240, 240, 240);
  doc.rect(15, yPosition - 4, pageWidth - 30, 6, 'F');
  
  doc.text('Description', 15, yPosition);
  doc.text('Unit Price', 130, yPosition);
  doc.text('Total', 170, yPosition);
  yPosition += 8;

  // Collect items
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

  if (data.products.beam.enabled && data.products.beam.material) {
    items.push({
      label: 'Beam',
      detail: data.products.beam.material,
      price: data.products.beam.price,
    });
  }

  if (data.products.surround.enabled && data.products.surround.description) {
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
      detail: `${data.labourDays} day(s) @ £800/day`,
      price: data.labourDays * 800,
    });
  }

  // Print items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  items.forEach((item) => {
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    const label = item.detail ? `${item.label} (${item.detail})` : item.label;
    doc.text(label.substring(0, 50), 15, yPosition);
    doc.text(`£${item.price.toFixed(2)}`, 130, yPosition);
    doc.text(`£${item.price.toFixed(2)}`, 170, yPosition);
    yPosition += 5;
  });

  yPosition += 3;

  // Totals section
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text('Subtotal (ex VAT):', 130, yPosition);
  doc.text(`£${subtotal.toFixed(2)}`, 170, yPosition);
  yPosition += 6;

  if (data.includeVat) {
    doc.text('VAT (20%):', 130, yPosition);
    doc.text(`£${vat.toFixed(2)}`, 170, yPosition);
    yPosition += 6;
  }

  // Total - bold and large
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(192, 40, 28); // Red
  doc.text('TOTAL:', 130, yPosition);
  doc.text(`£${total.toFixed(2)}`, 170, yPosition);

  yPosition += 10;

  // Payment terms
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Payment Terms:', 15, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('45% deposit on acceptance', 15, yPosition);
  yPosition += 4;
  doc.text('45% on materials arrival', 15, yPosition);
  yPosition += 4;
  doc.text('10% on completion', 15, yPosition);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('This quote is valid for 30 days. Terms & Conditions apply.', 15, pageHeight - 10);

  return doc.output('blob');
}
