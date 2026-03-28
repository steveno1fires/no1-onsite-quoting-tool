import jsPDF from 'jspdf';

/**
 * Convert a single data-URL image into a one-page PDF blob.
 * The image is scaled to fit an A4 page with a small margin.
 */
export async function imageToSinglePagePdf(dataUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const pageW = 210;
      const pageH = 297;
      const margin = 10;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;

      let w = img.width;
      let h = img.height;

      // Scale to fit
      const scale = Math.min(maxW / w, maxH / h, 1);
      w *= scale;
      h *= scale;

      const orientation = w > h ? 'l' : 'p';
      const pdf = new jsPDF(orientation, 'mm', 'a4');
      const pW = orientation === 'l' ? pageH : pageW;
      const pH = orientation === 'l' ? pageW : pageH;

      const x = (pW - w) / 2;
      const y = (pH - h) / 2;

      const format = dataUrl.includes('image/png') ? 'PNG' : 'JPEG';
      pdf.addImage(dataUrl, format, x, y, w, h);

      resolve(pdf.output('blob'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
