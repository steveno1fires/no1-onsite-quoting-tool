import { QuoteData } from "@/types/quote";
import { getLineItems, formatCurrency } from "@/lib/quoteLineItems";
import logo from "@/assets/logo.jpeg";

interface Props {
  data: QuoteData;
}

export function QuotePreview({ data }: Props) {
  const items = getLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white text-black w-full max-w-[595px] mx-auto shadow-xl rounded overflow-hidden" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '11px' }}>
      {/* Header */}
      <div className="bg-[#C0281C] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="No1 Fires" className="h-12 w-12 rounded object-cover" />
          <div>
            <p className="text-xl font-bold tracking-tight">No1 Fires</p>
            <p className="text-xs opacity-90">QUOTATION</p>
          </div>
        </div>
        <p className="text-xs opacity-80">{dateStr}</p>
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Client & Job Info */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Prepared for</p>
            <p className="font-semibold text-sm mt-0.5">{data.customer.clientName || '—'}</p>
            {data.customer.address && (
              <p className="text-[10px] text-gray-500 mt-0.5 max-w-[200px]">{data.customer.address}</p>
            )}
          </div>
          <div className="text-right text-[10px] text-gray-500">
            {data.customer.linkedJobNumber && <p>Job #{data.customer.linkedJobNumber}</p>}
            <p>Job Type: {data.jobType}</p>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Line Items Table */}
        <table className="w-full text-[10px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-1.5 px-2 font-semibold text-gray-700">Item</th>
              <th className="text-left py-1.5 px-2 font-semibold text-gray-700">Details</th>
              <th className="text-right py-1.5 px-2 font-semibold text-gray-700">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : ''}>
                <td className="py-1 px-2 font-medium">{item.label}</td>
                <td className="py-1 px-2 text-gray-500">{item.detail || ''}</td>
                <td className="py-1 px-2 text-right font-medium">{formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-[45%] space-y-1">
            <hr className="border-gray-200" />
            <div className="flex justify-between text-[10px] pt-1">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {data.includeVat && (
              <div className="flex justify-between text-[10px]">
                <span>VAT (20%)</span>
                <span className="font-medium">{formatCurrency(vat)}</span>
              </div>
            )}
            <div className="bg-[#C0281C] text-white rounded px-2 py-1.5 flex justify-between text-xs font-bold mt-1">
              <span>TOTAL</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-orange-50 rounded px-3 py-2">
          <p className="text-[9px] font-bold text-[#C0281C]">Payment Terms</p>
          <p className="text-[10px] text-gray-700">45% deposit  ·  45% on materials arrival  ·  10% on completion</p>
        </div>

        {/* Notes */}
        {data.notes && (
          <div>
            <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Notes</p>
            <p className="text-[10px] text-gray-700 whitespace-pre-wrap mt-0.5">{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-2 text-[8px] text-gray-400 flex justify-between">
          <span>No1 Fires  ·  Professional Fireplace Installation</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
