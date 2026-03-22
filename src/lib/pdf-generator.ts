import { supabase } from '@/integrations/supabase/client';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface CompensationStructure {
  basic_pay: number;
  dearness_allowance: number;
  house_rental: number;
  conveyance_allowance: number;
  special_allowance: number;
  medical_insurance: number;
}

interface GenerateOfferParams {
  htmlContent: string;
  letterheadUrl?: string | null;
  candidateName: string;
  jobTitle: string;
  joiningDate: string;
  payout: number | string;
  offerNumber: string;
  companyId: string;
  candidateId: string;
  isPredefinedHtml?: boolean;
  customVariableValues?: Record<string, string>;
  currency?: string;
  today?: string;
  offerLink?: string;
  compensationStructure?: CompensationStructure | null;
}

/**
 * Replaces template variables in HTML content with actual values.
 */
function substituteVariables(html: string, vars: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(vars)) {
    // Support case-insensitive replacement for base variables
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, value);
  }
  
  // Auto-fix for legacy template Javascript that incorrectly parses currency symbols
  // Changes: .replace(/,/g, '')  ->  .replace(/[^0-9.-]/g, '')
  result = result.replace(/\.replace\(\/\,\/g,\s*['"]['"]\)/g, ".replace(/[^0-9.-]/g, '')");
  
  return result;
}

/**
 * Formats a YYYY-MM-DD date string to 'MMM D, YYYY' format (e.g. Jan 8, 2027).
 */
function formatDateString(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.trim().split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  return dateStr;
}

/**
 * Builds the variable map from offer parameters.
 */
function buildVariableMap(params: {
  candidateName: string;
  jobTitle: string;
  joiningDate: string;
  payout: number | string;
  offerNumber: string;
  customVariableValues?: Record<string, string>;
  currency?: string;
  today?: string;
  offerLink?: string;
  compensationStructure?: CompensationStructure | null;
}): Record<string, string> {
  const payoutNum = typeof params.payout === 'string' 
    ? parseFloat(params.payout.replace(/[^0-9.-]+/g, "")) 
    : params.payout;

  const formattedPayout = (payoutNum || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: params.currency || 'USD',
  });

  const formattedJoiningDate = formatDateString(params.joiningDate);
  const formattedToday = params.today || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const baseMap: Record<string, string> = {
    '{{Name}}': params.candidateName,
    '{{candidate_name}}': params.candidateName,
    '{{Designation}}': params.jobTitle,
    '{{job_title}}': params.jobTitle,
    '{{Joined Date}}': formattedJoiningDate,
    '{{joined_date}}': formattedJoiningDate,
    '{{Payout}}': formattedPayout,
    '{{payout}}': formattedPayout,
    '{{Offer Number}}': params.offerNumber,
    '{{offer_number}}': params.offerNumber,
    '{{Offer Link}}': params.offerLink || '',
    '{{offer_link}}': params.offerLink || '',
    '{{Today}}': formattedToday,
    '{{today}}': formattedToday,
  };

  // Merge compensation structure variables
  if (params.compensationStructure) {
    const cs = params.compensationStructure;
    baseMap['{{Basic Pay Percent}}'] = `${cs.basic_pay}%`;
    baseMap['{{DA Percent}}'] = `${cs.dearness_allowance}%`;
    baseMap['{{HRA Percent}}'] = `${cs.house_rental}%`;
    baseMap['{{Conveyance Percent}}'] = `${cs.conveyance_allowance}%`;
    baseMap['{{Special Allowance Percent}}'] = `${cs.special_allowance}%`;
    baseMap['{{Medical Insurance Percent}}'] = `${cs.medical_insurance}%`;
  }

  // Merge custom variables into the map
  if (params.customVariableValues) {
    for (const [key, value] of Object.entries(params.customVariableValues)) {
      baseMap[`{{${key}}}`] = value;
    }
  }

  return baseMap;
}

/**
 * Builds the DOM element for predefined HTML mode.
 * No system styles, no padding, no letterhead, no wrapper divs.
 * The user's HTML is injected as-is — identical to how OfferLetterRenderer renders it in preview.
 */
function buildPredefinedHtmlElement(html: string): HTMLElement {
  const el = document.createElement('div');
  // Enforce zero margins on the container itself
  el.style.cssText = 'width: 210mm; margin: 0; padding: 0; border: none; background-color: white;';
  
  // A strict CSS reset applied ONLY to the very top elements.
  // This removes the "upper padding" caused by browser default paragraph/heading margins
  // while preserving the user's intended spacing between paragraphs inside the body.
  el.innerHTML = `
    <style>
      /* Force the wrapper into a tight Flexbox column to obliterate any whitespace, line-breaks, or visual margins between pages */
      #pdf-predefined-wrapper {
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }
      #pdf-predefined-wrapper > *:first-child {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }
      #pdf-predefined-wrapper > *:first-child > *:first-child {
        margin-top: 0 !important; 
        padding-top: 0 !important;
      }
      /* Kill all external separation/margins on the pages themselves to guarantee mathematical canvas slicing alignment */
      #pdf-predefined-wrapper .page {
        margin: 0 !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      /* Hide any stray <br> tags placed between pages */
      #pdf-predefined-wrapper > br {
        display: none !important;
      }
    </style>
    <div id="pdf-predefined-wrapper">
      ${html}
    </div>
  `;
  
  return el;
}

/**
 * Builds the DOM element for raw/standard HTML mode.
 * Applies system layout: letterhead image, padding, typography styles.
 */
function buildRawHtmlElement(html: string, letterheadUrl?: string | null): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText =
    'width:210mm;min-height:297mm;padding:0;margin:0;background-color:white;color:#1e293b;font-family:sans-serif;';

  let letterheadBlock = '';
  if (letterheadUrl) {
    letterheadBlock = `
      <div style="width:100%;max-height:150px;overflow:hidden;display:flex;justify-content:center;background-color:white;">
        <img src="${letterheadUrl}" style="width:100%;object-fit:contain;max-height:150px;" crossorigin="anonymous" />
      </div>`;
  }

  el.innerHTML = `
    <div style="background-color:white;">
      ${letterheadBlock}
      <div style="padding:40px 60px;line-height:1.6;">
        <style>
          h1 { font-size:28pt; font-weight:800; color:#0f172a; border-bottom:2pt solid #f1f5f9; padding-bottom:15pt; margin-bottom:30pt; font-family:sans-serif; }
          h2 { font-size:18pt; font-weight:700; color:#1e293b; margin-top:25pt; margin-bottom:12pt; font-family:sans-serif; }
          p  { font-size:11pt; color:#334155; margin-bottom:15pt; line-height:1.6; font-family:sans-serif; }
          table { width:100%; border-collapse:collapse; margin:20pt 0; }
          th, td { border:1px solid #e2e8f0; padding:10pt; text-align:left; font-size:10pt; }
          th { background-color:#f8fafc; font-weight:600; color:#475569; }
        </style>
        ${html}
      </div>
    </div>`;

  return el;
}

/**
 * Main: generates a PDF blob from offer HTML, uploads it to Supabase Storage, returns the path and the final manipulated HTML.
 */
export async function generateAndUploadOfferPDF(params: GenerateOfferParams): Promise<{ pdfPath: string, manipulatedHtml: string }> {
  const { htmlContent, letterheadUrl, companyId, candidateId, candidateName, isPredefinedHtml = false, currency } = params;

  // 1. Replace template variables
  const vars = buildVariableMap(params);
  const finalHtml = substituteVariables(htmlContent, vars);

  // 2. Build the source element — completely different paths for each mode
  const pdfElement = isPredefinedHtml
    ? buildPredefinedHtmlElement(finalHtml)
    : buildRawHtmlElement(finalHtml, letterheadUrl);

  // 3. Configure html2pdf options — zero margin for predefined, 10mm for raw
  const opt = {
    margin: (isPredefinedHtml ? [0, 0, 0, 0] : [10, 10, 10, 10]) as [number, number, number, number],
    filename: `Offer-${candidateName.replace(/\s+/g, '-')}.pdf`,
    image: { type: 'jpeg' as const, quality: 1 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 794 // 210mm in pixels at 96 dpi to perfectly lock layout calculations.
    },
    jsPDF: isPredefinedHtml 
      ? { unit: 'px' as const, format: [794, 1123] as [number, number], orientation: 'portrait' as const, hotfixes: ["px_scaling"] }
      : { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: isPredefinedHtml ? { mode: [] } : { mode: ['css', 'legacy'] }
  };

  // 4. Generate PDF blob safely to avoid scrollbar layout shifts during capture
  let pdfBlob: Blob;
  const originalOverflow = document.body.style.overflow;
  try {
    document.body.style.overflow = 'hidden';

    // Must attach pdfElement temporarily to the actual document so `document.getElementById` works inside the template's scripts
    pdfElement.style.position = 'absolute';
    pdfElement.style.top = '-9999px';
    pdfElement.style.left = '-9999px';
    pdfElement.style.visibility = 'hidden';
    document.body.appendChild(pdfElement);

    // Re-create and execute any <script> tags found in the template (innerHTML does not run them)
    const scripts = Array.from(pdfElement.querySelectorAll('script'));
    const executableScripts: HTMLScriptElement[] = [];

    for (const oldScript of scripts) {
      const newScript = document.createElement('script');
      newScript.textContent = oldScript.textContent || '';
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
      executableScripts.push(newScript);
    }

    // Wait a brief moment to allow the microtasks and synchronous JS (like CTC calculations) to update the DOM
    if (scripts.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Capture the manipulated HTML *after* the scripts have run, so the email/database gets the calculated numbers
    const manipulatedHtml = pdfElement.innerHTML;

    // Remove the hiding styles so HTML2Canvas renders it correctly
    pdfElement.style.position = '';
    pdfElement.style.top = '';
    pdfElement.style.left = '';
    pdfElement.style.visibility = '';
    if (document.body.contains(pdfElement)) {
      document.body.removeChild(pdfElement);
    }

    // Now snap the PDF!
    pdfBlob = await html2pdf().set(opt).from(pdfElement).output('blob');

    // 5. Upload to Supabase Storage
    const fileName = `${companyId}/${candidateId}_offer_${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('offer_letters')
      .upload(fileName, pdfBlob, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    return { pdfPath: uploadData.path, manipulatedHtml };

  } finally {
    document.body.style.overflow = originalOverflow;
    if (document.body.contains(pdfElement)) {
      document.body.removeChild(pdfElement);
    }
  }
}

/**
 * Utility: replaces variables in HTML without generating a PDF.
 * Used by CandidateActions to get the final HTML for inline storage.
 */
export function replaceHtmlVariables(
  htmlContent: string,
  params: Omit<GenerateOfferParams, 'htmlContent' | 'companyId' | 'candidateId' | 'letterheadUrl' | 'isPredefinedHtml'>
): string {
  const vars = buildVariableMap(params);
  return substituteVariables(htmlContent, vars);
}
