import * as XLSX from 'xlsx';
import { QuoteData } from '@/types/quote';
import { getLineItems } from './quoteLineItems';

export function generateCostsExcel(data: QuoteData): Blob {
  const items = getLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;

  const rows: (string | number)[][] = [
    ['OUR COSTS', '', ''],
    [`Client: ${data.customer.clientName}`, '', `Job #${data.customer.linkedJobNumber || data.customer.jobNumber}`],
    [`Job Type: ${data.jobType}`, '', `Date: ${new Date().toLocaleDateString('en-GB')}`],
    [],
    ['Item', 'Detail', 'Price (£)'],
  ];

  items.forEach((item) => {
    rows.push([item.label, item.detail || '', item.price]);
  });

  rows.push([]);
  rows.push(['', 'Subtotal (ex VAT)', subtotal]);
  if (data.includeVat) {
    rows.push(['', 'VAT (20%)', vat]);
  }
  rows.push(['', 'TOTAL', total]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 15 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Costs');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function getCostsFilename(data: QuoteData): string {
  const clientName = data.customer.clientName.replace(/\s+/g, '_') || 'Unknown';
  const jobNum = data.customer.linkedJobNumber || data.customer.jobNumber || 'NoJob';
  return `OUR_COSTS_${clientName}-${jobNum}.xlsx`;
}
