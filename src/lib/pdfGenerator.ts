import jsPDF from 'jspdf';
import { QuoteData } from '@/types/quote';
import { getLineItems, formatCurrency } from './quoteLineItems';
import logoJpeg from '@/assets/logo.jpeg';

const PRIMARY_R = 192, PRIMARY_G = 40, PRIMARY_B = 28; // #C0281C
const DARK = [33, 33, 33] as const;
const GREY = [120, 120, 120] as const;
const LIGHT_BG = [248, 248, 248] as const;

async function loadLogoAsBase64(): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = logoJpeg;
  });
}

export async function generateQuotePDF(data: QuoteData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = 0;

  // Load logo
  let logoBase64: string;
  try {
    logoBase64 = await loadLogoAsBase64();
  } catch {
    logoBase64 = '';
  }

  // --- HEADER ---
  // Red banner
  pdf.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.rect(0, 0, pageW, 38, 'F');

  // Logo
  if (logoBase64) {
    pdf.addImage(logoBase64, 'JPEG', margin, 6, 26, 26);
  }

  // Company name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('No1 Fires', margin + 30, 18);

  // "QUOTATION" label
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('QUOTATION', margin + 30, 26);

  // Date on right
  pdf.setFontSize(9);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  pdf.text(dateStr, pageW - margin, 18, { align: 'right' });

  y = 46;

  // --- CLIENT & JOB INFO ---
  pdf.setTextColor(...DARK);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Prepared for:', margin, y);
  y += 5;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(data.customer.clientName || '—', margin, y);
  y += 5;

  if (data.customer.address) {
    pdf.setFontSize(9);
    pdf.setTextColor(...GREY);
    const addrLines = pdf.splitTextToSize(data.customer.address, contentW / 2);
    pdf.text(addrLines, margin, y);
    y += addrLines.length * 4;
  }

  // Job info on right side
  const rightX = pageW - margin;
  let ry = 46;
  if (data.customer.linkedJobNumber) {
    pdf.setFontSize(9);
    pdf.setTextColor(...GREY);
    pdf.text(`Job #${data.customer.linkedJobNumber}`, rightX, ry, { align: 'right' });
    ry += 5;
  }
  pdf.setTextColor(...DARK);
  pdf.setFontSize(9);
  pdf.text(`Job Type: ${data.jobType}`, rightX, ry, { align: 'right' });

  y = Math.max(y, ry) + 8;

  // --- DIVIDER ---
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(margin, y, pageW - margin, y);
  y += 6;

  // --- LINE ITEMS TABLE ---
  const items = getLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;

  // Table header
  pdf.setFillColor(...LIGHT_BG);
  pdf.rect(margin, y - 3, contentW, 7, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...DARK);
  pdf.text('Item', margin + 2, y + 1);
  pdf.text('Details', margin + 60, y + 1);
  pdf.text('Price', pageW - margin - 2, y + 1, { align: 'right' });
  y += 8;

  // Table rows
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);

  items.forEach((item, i) => {
    // Check page break
    if (y > 265) {
      pdf.addPage();
      y = 20;
    }

    // Alternate row shading
    if (i % 2 === 0) {
      pdf.setFillColor(252, 252, 252);
      pdf.rect(margin, y - 3.5, contentW, 6, 'F');
    }

    pdf.setTextColor(...DARK);
    pdf.text(item.label, margin + 2, y);

    if (item.detail) {
      pdf.setTextColor(...GREY);
      const detailTrunc = item.detail.length > 50 ? item.detail.substring(0, 47) + '...' : item.detail;
      pdf.text(detailTrunc, margin + 60, y);
    }

    pdf.setTextColor(...DARK);
    pdf.text(formatCurrency(item.price), pageW - margin - 2, y, { align: 'right' });
    y += 6;
  });

  y += 2;

  // --- TOTALS ---
  pdf.setDrawColor(220, 220, 220);
  pdf.line(margin + contentW * 0.55, y, pageW - margin, y);
  y += 6;

  const totalsX = margin + contentW * 0.55;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK);
  pdf.text('Subtotal', totalsX, y);
  pdf.text(formatCurrency(subtotal), pageW - margin - 2, y, { align: 'right' });
  y += 5;

  if (data.includeVat) {
    pdf.text('VAT (20%)', totalsX, y);
    pdf.text(formatCurrency(vat), pageW - margin - 2, y, { align: 'right' });
    y += 5;
  }

  // Total highlight
  pdf.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.rect(totalsX - 2, y - 3.5, (pageW - margin) - totalsX + 4, 8, 'F');
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('TOTAL', totalsX, y + 1);
  pdf.text(formatCurrency(total), pageW - margin - 2, y + 1, { align: 'right' });
  y += 14;

  // --- PAYMENT TERMS ---
  if (y > 255) { pdf.addPage(); y = 20; }

  pdf.setFillColor(255, 243, 224);
  pdf.roundedRect(margin, y - 2, contentW, 14, 2, 2, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.text('Payment Terms', margin + 4, y + 3);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK);
  pdf.text('45% deposit  ·  45% on materials arrival  ·  10% on completion', margin + 4, y + 8);
  y += 18;

  // --- NOTES ---
  if (data.notes) {
    if (y > 250) { pdf.addPage(); y = 20; }
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...GREY);
    pdf.text('Notes', margin, y);
    y += 4;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...DARK);
    const noteLines = pdf.splitTextToSize(data.notes, contentW);
    pdf.text(noteLines, margin, y);
  }

  // --- FOOTER ---
  const pageCount = pdf.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    pdf.setPage(p);
    pdf.setFontSize(7);
    pdf.setTextColor(...GREY);
    pdf.text('No1 Fires  ·  Professional Fireplace Installation', margin, 290);
    pdf.text(`Page ${p} of ${pageCount}`, pageW - margin, 290, { align: 'right' });
  }

  return pdf.output('blob');
}
