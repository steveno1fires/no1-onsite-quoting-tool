import jsPDF from 'jspdf';
import { QuoteData } from '@/types/quote';
import { getProposalLineItems, getProposalTotal, getLineItems, formatCurrency } from './quoteLineItems';
import logoJpeg from '@/assets/logo.jpeg';

const PRIMARY_R = 192, PRIMARY_G = 40, PRIMARY_B = 28;
const DARK = [40, 40, 40] as const;
const GREY = [130, 130, 130] as const;
const LIGHT_BG = [250, 250, 250] as const;

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

function checkPageBreak(pdf: jsPDF, y: number, needed: number, margin: number): number {
  if (y + needed > 275) {
    pdf.addPage();
    return margin + 5;
  }
  return y;
}

export async function generateQuotePDF(data: QuoteData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  let logoBase64 = '';
  try { logoBase64 = await loadLogoAsBase64(); } catch {}

  // ── HEADER BANNER ──
  pdf.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.rect(0, 0, pageW, 44, 'F');

  if (logoBase64) {
    pdf.addImage(logoBase64, 'JPEG', margin, 7, 30, 30);
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  pdf.text('No1 Fires', margin + 35, 22);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Professional Fireplace Installation', margin + 35, 30);

  // PROPOSAL badge on right
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PROPOSAL', pageW - margin, 20, { align: 'right' });
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  pdf.text(dateStr, pageW - margin, 28, { align: 'right' });

  y = 54;

  // ── CLIENT INFO BOX ──
  pdf.setFillColor(...LIGHT_BG);
  const clientBoxH = 28 + (data.customer.address ? 5 : 0);
  pdf.roundedRect(margin, y, contentW, clientBoxH, 2, 2, 'F');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...GREY);
  pdf.text('PREPARED FOR', margin + 5, y + 6);

  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...DARK);
  pdf.text(data.customer.clientName || '—', margin + 5, y + 14);

  let infoY = y + 6;
  const rightCol = pageW - margin - 5;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...GREY);

  if (data.customer.linkedJobNumber) {
    pdf.text(`JOB #${data.customer.linkedJobNumber}`, rightCol, infoY, { align: 'right' });
    infoY += 5;
  }
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK);
  pdf.setFontSize(9);
  pdf.text(data.jobType || '', rightCol, infoY, { align: 'right' });

  if (data.customer.address) {
    pdf.setFontSize(9);
    pdf.setTextColor(...GREY);
    const addrLines = pdf.splitTextToSize(data.customer.address, contentW * 0.5);
    pdf.text(addrLines, margin + 5, y + 20);
  }

  y += clientBoxH + 10;

  // ── SCOPE OF WORKS ──
  const items = getProposalLineItems(data);
  const total = getProposalTotal(data);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.text('Scope of Works', margin, y);
  y += 2;
  pdf.setDrawColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, margin + 35, y);
  y += 6;

  // Items list — clean proposal style, no prices per line
  pdf.setFontSize(9);
  items.forEach((item) => {
    y = checkPageBreak(pdf, y, 8, margin);

    // Bullet
    pdf.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
    pdf.circle(margin + 2, y - 1, 0.8, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK);
    pdf.text(item.label, margin + 6, y);

    if (item.detail) {
      const labelW = pdf.getTextWidth(item.label);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...GREY);
      const detailTrunc = item.detail.length > 55 ? item.detail.substring(0, 52) + '...' : item.detail;
      pdf.text(`— ${detailTrunc}`, margin + 6 + labelW + 2, y);
    }

    y += 6;
  });

  y += 4;

  // ── TOTAL BOX ──
  y = checkPageBreak(pdf, y, 20, margin);

  pdf.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.roundedRect(margin, y, contentW, 16, 2, 2, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.includeVat ? 'Total (inc. VAT)' : 'Total (ex. VAT)', margin + 6, y + 10);

  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(formatCurrency(total), pageW - margin - 6, y + 10.5, { align: 'right' });

  y += 24;

  // ── PAYMENT TERMS ──
  y = checkPageBreak(pdf, y, 22, margin);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.text('Payment Terms', margin, y);
  y += 2;
  pdf.setDrawColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.line(margin, y, margin + 35, y);
  y += 6;

  const terms = [
    { pct: '45%', desc: 'Due on acceptance of this proposal' },
    { pct: '45%', desc: 'Due on delivery of materials' },
    { pct: '10%', desc: 'Due on completion of works' },
  ];

  terms.forEach((t) => {
    y = checkPageBreak(pdf, y, 7, margin);
    pdf.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
    pdf.circle(margin + 2, y - 1, 0.8, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK);
    pdf.setFontSize(9);
    pdf.text(t.pct, margin + 6, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...GREY);
    pdf.text(`— ${t.desc}`, margin + 6 + pdf.getTextWidth(t.pct) + 2, y);
    y += 6;
  });

  y += 4;

  // ── NOTES ──
  if (data.notes) {
    y = checkPageBreak(pdf, y, 20, margin);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
    pdf.text('Additional Notes', margin, y);
    y += 2;
    pdf.setDrawColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
    pdf.line(margin, y, margin + 38, y);
    y += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...DARK);
    const noteLines = pdf.splitTextToSize(data.notes, contentW - 4);
    noteLines.forEach((line: string) => {
      y = checkPageBreak(pdf, y, 5, margin);
      pdf.text(line, margin + 2, y);
      y += 4.5;
    });
  }

  // ── FOOTER on all pages ──
  const pageCount = pdf.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    pdf.setPage(p);
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.3);
    pdf.line(margin, 284, pageW - margin, 284);

    pdf.setFontSize(7);
    pdf.setTextColor(...GREY);
    pdf.text('No1 Fires  |  Professional Fireplace Installation  |  pdf.text('No1 Fires  |  Professional Fireplace Installation  |  All prices valid for 7 days', margin, 289);', margin, 289);
    pdf.text(`Page ${p} of ${pageCount}`, pageW - margin, 289, { align: 'right' });
  }

  return pdf.output('blob');
}

/** Generate a separate "OUR COSTS" PDF (internal use only) */
export async function generateCostsPDF(data: QuoteData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 0;

  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Header banner
  pdf.setFillColor(PRIMARY_R, PRIMARY_G, PRIMARY_B);
  pdf.rect(0, 0, pageW, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OUR COSTS', margin, 20);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(dateStr, pageW - margin, 20, { align: 'right' });

  y = 40;

  // Client & job info
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...DARK);
  pdf.text(`Client: ${data.customer.clientName || '—'}`, margin, y);
  pdf.text(`Job #${data.customer.linkedJobNumber || data.customer.jobNumber || '—'}`, pageW - margin, y, { align: 'right' });
  y += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...GREY);
  pdf.text(`Job Type: ${data.jobType || '—'}`, margin, y);
  y += 10;

  // Table header
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, y - 4, contentW, 8, 'F');
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...DARK);
  pdf.text('Item', margin + 3, y);
  pdf.text('Detail', margin + 60, y);
  pdf.text('Price (£)', pageW - margin - 3, y, { align: 'right' });
  y += 8;

  const costItems = getLineItems(data);
  const costSubtotal = costItems.reduce((sum, item) => sum + item.price, 0);
  const costVat = data.includeVat ? costSubtotal * 0.2 : 0;
  const costTotal = costSubtotal + costVat;

  pdf.setFontSize(8);
  costItems.forEach((item, idx) => {
    y = checkPageBreak(pdf, y, 6, margin);

    if (idx % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, y - 3.5, contentW, 6, 'F');
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...DARK);
    pdf.text(item.label, margin + 3, y);

    if (item.detail) {
      pdf.setTextColor(...GREY);
      const detailTrunc = item.detail.length > 45 ? item.detail.substring(0, 42) + '...' : item.detail;
      pdf.text(detailTrunc, margin + 60, y);
    }

    pdf.setTextColor(...DARK);
    pdf.text(`£${item.price.toFixed(2)}`, pageW - margin - 3, y, { align: 'right' });
    y += 6;
  });

  y += 4;

  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin + contentW * 0.5, y, pageW - margin, y);
  y += 6;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK);
  pdf.text('Subtotal (ex VAT)', pageW - margin - 40, y);
  pdf.text(`£${costSubtotal.toFixed(2)}`, pageW - margin - 3, y, { align: 'right' });
  y += 6;

  if (data.includeVat) {
    pdf.text('VAT (20%)', pageW - margin - 40, y);
    pdf.text(`£${costVat.toFixed(2)}`, pageW - margin - 3, y, { align: 'right' });
    y += 6;
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('TOTAL', pageW - margin - 40, y);
  pdf.text(`£${costTotal.toFixed(2)}`, pageW - margin - 3, y, { align: 'right' });

  // Footer
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.line(margin, 284, pageW - margin, 284);
  pdf.setFontSize(7);
  pdf.setTextColor(...GREY);
  pdf.text('No1 Fires  |  INTERNAL COSTS — NOT FOR CUSTOMER', margin, 289);

  return pdf.output('blob');
}
