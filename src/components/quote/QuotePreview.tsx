import { QuoteData } from "@/types/quote";
import { getProposalLineItems, getProposalTotal, formatCurrency } from "@/lib/quoteLineItems";
import logo from "@/assets/logo.jpeg";

interface Props {
  data: QuoteData;
}

export function QuotePreview({ data }: Props) {
  const items = getProposalLineItems(data);
  const total = getProposalTotal(data);
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white text-black w-full max-w-[595px] mx-auto shadow-xl rounded-lg overflow-hidden border border-gray-200" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: '#C0281C' }} className="text-white px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="No1 Fires" className="h-14 w-14 rounded-lg object-cover shadow-md" />
          <div>
            <p className="text-2xl font-bold tracking-tight">No1 Fires</p>
            <p className="text-xs opacity-80">Professional Fireplace Installation</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold tracking-wide">PROPOSAL</p>
          <p className="text-xs opacity-70 mt-0.5">{dateStr}</p>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Client Info Box */}
        <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between items-start">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Prepared for</p>
            <p className="font-bold text-base mt-0.5 text-gray-900">{data.customer.clientName || '—'}</p>
            {data.customer.address && (
              <p className="text-[10px] text-gray-500 mt-0.5 max-w-[220px] leading-tight">{data.customer.address}</p>
            )}
          </div>
          <div className="text-right">
            {data.customer.linkedJobNumber && (
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Job #{data.customer.linkedJobNumber}</p>
            )}
            <p className="text-[10px] text-gray-600 mt-0.5">{data.jobType}</p>
          </div>
        </div>

        {/* Scope of Works */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold" style={{ color: '#C0281C' }}>Scope of Works</h3>
            <div className="h-[2px] w-8" style={{ backgroundColor: '#C0281C' }} />
          </div>
          <div className="space-y-1.5">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-[10px]">
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C0281C' }} />
                <span>
                  <span className="font-semibold text-gray-900">{item.label}</span>
                  {item.detail && <span className="text-gray-500"> — {item.detail}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Box */}
        <div className="rounded-lg px-5 py-3 flex items-center justify-between" style={{ backgroundColor: '#C0281C' }}>
          <span className="text-white text-sm">{data.includeVat ? 'Total (inc. VAT)' : 'Total (ex. VAT)'}</span>
          <span className="text-white text-xl font-bold">{formatCurrency(total)}</span>
        </div>

        {/* Payment Terms */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-bold" style={{ color: '#C0281C' }}>Payment Terms</h3>
            <div className="h-[2px] w-8" style={{ backgroundColor: '#C0281C' }} />
          </div>
          <div className="space-y-1.5 text-[10px]">
            {[
              { pct: '45%', desc: 'Due on acceptance of this proposal' },
              { pct: '45%', desc: 'Due on delivery of materials' },
              { pct: '10%', desc: 'Due on completion of works' },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#C0281C' }} />
                <span>
                  <span className="font-semibold text-gray-900">{t.pct}</span>
                  <span className="text-gray-500"> — {t.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-bold" style={{ color: '#C0281C' }}>Additional Notes</h3>
              <div className="h-[2px] w-8" style={{ backgroundColor: '#C0281C' }} />
            </div>
            <p className="text-[10px] text-gray-700 whitespace-pre-wrap leading-relaxed">{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-2 text-[8px] text-gray-400 flex justify-between">
          <span>No1 Fires  |  Professional Fireplace Installation  |  All prices valid for 30 days</span>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
