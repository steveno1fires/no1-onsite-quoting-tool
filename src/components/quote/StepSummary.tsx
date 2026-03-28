import { QuoteData } from "@/types/quote";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, Send, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { generateQuotePDF } from "@/lib/pdfGenerator";
import { getLineItems, formatCurrency } from "@/lib/quoteLineItems";
import { QuotePreview } from "@/components/quote/QuotePreview";
import { toast } from "sonner";

interface Props {
  data: QuoteData;
  onToggleVat: (v: boolean) => void;
}

export function StepSummary({ data, onToggleVat }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const items = getLineItems(data);
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const vat = data.includeVat ? subtotal * 0.2 : 0;
  const total = subtotal + vat;

  const handlePreview = async () => {
    try {
      setIsGenerating(true);
      const pdfBlob = await generateQuotePDF(data);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPreviewPdf(pdfUrl);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('Failed to generate preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const pdfBlob = await generateQuotePDF(data);
      const filename = `Quote_Job${data.customer.jobNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setShowPreview(false);
      toast.success('Quote PDF downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUploadToSM8 = async () => {
    if (!data.customer.linkedJobUuid) {
      toast.error("No job linked — please link a ServiceM8 job on the Customer step first");
      return;
    }

    try {
      setIsUploading(true);
      const pdfBlob = await generateQuotePDF(data);

      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      const filename = `Quote_${data.customer.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

      const res = await fetch('/api/servicem8/upload-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobUuid: data.customer.linkedJobUuid,
          filename,
          fileBase64: base64,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(`Quote uploaded to SM8 Job #${data.customer.linkedJobNumber}`);
      } else {
        toast.error(result.error || 'Failed to upload to ServiceM8');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload quote to ServiceM8');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {showPreview && previewPdf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">Quote Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="flex-1 overflow-auto min-h-[400px]">
              <iframe src={previewPdf} className="w-full h-full min-h-[400px]" />
            </div>
            <div className="flex gap-2 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowPreview(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleDownload} disabled={isGenerating}>Download</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 animate-slide-in">
        {/* PDF-style preview */}
        <QuotePreview data={data} />

        {/* VAT toggle */}
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Include VAT (20%)</Label>
              <Switch checked={data.includeVat} onCheckedChange={onToggleVat} />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total: <span className="font-bold text-foreground text-lg">{formatCurrency(total)}</span></p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button variant="outline" className="w-full" onClick={handlePreview} disabled={isGenerating}>
            <Eye className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Preview PDF'}
          </Button>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate & Download Quote
              </>
            )}
          </Button>
          {data.customer.linkedJobUuid && (
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
              size="lg"
              onClick={handleUploadToSM8}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading to SM8...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Quote to SM8 Job #{data.customer.linkedJobNumber}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
