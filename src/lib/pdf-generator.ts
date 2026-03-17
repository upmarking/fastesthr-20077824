import { supabase } from '@/integrations/supabase/client';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface GenerateOfferParams {
  htmlContent: string;
  letterheadUrl?: string | null;
  candidateName: string;
  jobTitle: string;
  joiningDate: string;
  payout: number;
  offerNumber: string;
  companyId: string;
  candidateId: string;
}

export async function generateAndUploadOfferPDF(params: GenerateOfferParams): Promise<string> {
  const {
    htmlContent,
    letterheadUrl,
    candidateName,
    jobTitle,
    joiningDate,
    payout,
    offerNumber,
    companyId,
    candidateId
  } = params;

  // 1. Replace variables
  const formattedPayout = payout.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const replacements: Record<string, string> = {
    '{{Name}}': candidateName,
    '{{candidate_name}}': candidateName,
    '{{first_name}}': candidateName.split(' ')[0],
    '{{Designation}}': jobTitle,
    '{{job_title}}': jobTitle,
    '{{Joined Date}}': joiningDate,
    '{{Payout}}': formattedPayout,
    '{{Offer Number}}': offerNumber,
    '{{offer_number}}': offerNumber
  };

  let finalHtml = htmlContent;
  Object.keys(replacements).forEach(key => {
    finalHtml = finalHtml.split(key).join(replacements[key]);
  });

  // 2. Wrap HTML for PDF formatting with letterhead
  const pdfContainer = document.createElement('div');
  pdfContainer.style.width = '210mm'; // A4 width
  pdfContainer.style.minHeight = '297mm'; // A4 height
  pdfContainer.style.padding = '0';
  pdfContainer.style.margin = '0';
  pdfContainer.style.backgroundColor = 'white';
  pdfContainer.style.color = '#1e293b';
  pdfContainer.style.fontFamily = 'sans-serif';

  let letterheadHtml = '';
  if (letterheadUrl) {
    letterheadHtml = `
      <div style="width: 100%; max-height: 150px; overflow: hidden; display: flex; justify-content: center; background-color: white;">
        <img src="${letterheadUrl}" style="width: 100%; object-fit: contain; max-height: 150px;" crossorigin="anonymous" />
      </div>
    `;
  }

  pdfContainer.innerHTML = `
    <div style="background-color: white;">
      ${letterheadHtml}
      <div style="padding: 40px 60px; line-height: 1.6;">
        <style>
          h1 { font-size: 28pt; font-weight: 800; color: #0f172a; border-bottom: 2pt solid #f1f5f9; padding-bottom: 15pt; margin-bottom: 30pt; font-family: sans-serif; }
          h2 { font-size: 18pt; font-weight: 700; color: #1e293b; margin-top: 25pt; margin-bottom: 12pt; font-family: sans-serif; }
          p { font-size: 11pt; color: #334155; margin-bottom: 15pt; line-height: 1.6; font-family: sans-serif; }
          table { width: 100%; border-collapse: collapse; margin: 20pt 0; }
          th, td { border: 1px solid #e2e8f0; padding: 10pt; text-align: left; font-size: 10pt; }
          th { background-color: #f8fafc; font-weight: 600; color: #475569; }
        </style>
        ${finalHtml}
      </div>
    </div>
  `;

  // 3. Generate PDF Blob using html2pdf
  const opt = {
    margin:       10,
    filename:     `Offer-${candidateName.replace(/\s+/g, '-')}.pdf`,
    image:        { type: 'jpeg' as const, quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  };

  const pdfBlob: Blob = await html2pdf().set(opt).from(pdfContainer).output('blob');

  // 4. Upload to Supabase Storage
  const fileName = `${companyId}/${candidateId}_offer_${Date.now()}.pdf`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('offer_letters')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadError) {
    throw new Error(`Failed to upload PDF: ${uploadError.message}`);
  }

  // Get public URL or direct path
  // Using public URL if bucket is public, but we set it to private.
  // Wait, we need to get a signed URL or just store the path and edge function can download it using service role key.
  // We'll return the path, and edge function will download it or generate signed URL for emails.
  // Actually, emails just attach the file. So Edge function downloads via service role.
  return uploadData.path;
}

export function replaceHtmlVariables(htmlContent: string, params: Omit<GenerateOfferParams, 'htmlContent' | 'companyId' | 'candidateId' | 'letterheadUrl'>) {
    const {
        candidateName,
        jobTitle,
        joiningDate,
        payout,
        offerNumber,
      } = params;
    
      const formattedPayout = payout.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const replacements: Record<string, string> = {
        '{{Name}}': candidateName,
        '{{candidate_name}}': candidateName,
        '{{first_name}}': candidateName.split(' ')[0],
        '{{Designation}}': jobTitle,
        '{{job_title}}': jobTitle,
        '{{Joined Date}}': joiningDate,
        '{{Payout}}': formattedPayout,
        '{{Offer Number}}': offerNumber,
        '{{offer_number}}': offerNumber
      };
    
      let finalHtml = htmlContent;
      Object.keys(replacements).forEach(key => {
        finalHtml = finalHtml.split(key).join(replacements[key]);
      });
      return finalHtml;
}
