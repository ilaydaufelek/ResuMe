/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";


// Puppeteer yalnızca Node.js runtime'da çalışır
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/* ================== Types ================== */
export type ExperienceItem = { company?: string; date?: string };
export type EducationItem = { name?: string; date?: string };
export type CertificationItem = { name?: string; date?: string };
export type LanguageItem = { name?: string; level?: number };

export type FormValues = {
  fullname?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  summary?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  languages?: LanguageItem[];
  templateType?: "kakuna" | "onyx" | "bronzor";
};

/* ================== Route ================== */
export async function POST(req: Request) {
  let browser: Browser | null = null;
 
  try {
    const raw = (await req.json()) as FormValues;

    const data: Required<FormValues> = {
      fullname: raw.fullname ?? "",
      email: raw.email ?? "",
      phone: raw.phone ?? "",
      location: raw.location ?? "",
      website: raw.website ?? "",
      summary: raw.summary ?? "",
      experience: raw.experience ?? [],
      education: raw.education ?? [],
      certifications: raw.certifications ?? [],
      languages: raw.languages ?? [],
      templateType: (raw.templateType ?? "kakuna") as any,
    };

    const template = (data.templateType || "kakuna").toLowerCase() as
      | "kakuna"
      | "onyx"
      | "bronzor";

    const html =
      template === "onyx"
        ? generateOnyxTemplate(data)
        : template === "bronzor"
        ? generateBronzorTemplate(data)
        : generateKakunaTemplate(data);

    const isVercel = !!process.env.VERCEL;

  const executablePath = isVercel
  ? await chromium.executablePath() // Vercel ortamında otomatik
  : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const args = chromium.args;

// Puppeteer launch
browser = await puppeteer.launch({
  args,
  executablePath,
  headless: true,
  defaultViewport: { width: 1200, height: 800 },
});

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle2", timeout: 45000 });

    const pdfUint8: any = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    const filename = `cv-${template}.pdf`;

    return new Response(pdfUint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfUint8.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const payload = getErrorPayload(error);
    console.error("PDF generation error:", payload.console);
    return NextResponse.json(payload.body, { status: 500 });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* yut */
      }
    }
  }
}

/* ================== Error helper ================== */
function getErrorPayload(error: unknown) {
  if (error instanceof Error) {
    return {
      console: { name: error.name, message: error.message, stack: error.stack },
      body: { error: "PDF oluşturulurken hata oluştu", detail: error.message },
    };
  }
  if (typeof error === "string") {
    return {
      console: { message: error },
      body: { error: "PDF oluşturulurken hata oluştu", detail: error },
    };
  }
  try {
    return {
      console: { raw: error },
      body: {
        error: "PDF oluşturulurken hata oluştu",
        detail: JSON.stringify(error),
      },
    };
  } catch {
    return {
      console: { raw: String(error) },
      body: { error: "PDF oluşturulurken hata oluştu", detail: "Unknown error" },
    };
  }
}

/* ================== Base Head ================== */
function baseHead() {
  return `
    <meta charset="utf-8" />
    <meta name="color-scheme" content="light only" />
    <style>
      :root { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
    </style>
  `;
}

/* ================== Templates ================== */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSafeValue(value: string | undefined): string {
  return value ? escapeHtml(value) : "";
}

/* ---------- Kakuna ---------- */
function generateKakunaTemplate(data: Required<FormValues>): string {
  return `
    <html>
      <head>
        ${baseHead()}
      </head>
      <body style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial; color: #18181b; background: #fff; padding: 16px;">
        <div style="color: #18181b; width: 750px; padding: 16px; margin: 0 auto; margin-bottom: 32px; display: flex; flex-direction: column; gap: 8px;">
          <!-- Fullname -->
          <div style="margin-bottom: 8px;">
            <p style="font-weight: 600; display: flex; justify-content: center; align-items: center; font-size: 20px; line-height: 28px; overflow-x: auto; margin: 0;">
              ${getSafeValue(data.fullname)}
            </p>
          </div>

          <!-- Contact Info -->
          <div style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 16px; overflow: auto;">
            ${data.location ? `
              <p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                ${getSafeValue(data.location)}
              </p>` : ''}
            
            ${data.phone ? `
              <p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                ${getSafeValue(data.phone)}
              </p>` : ''}
            
            ${data.email ? `
              <p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                ${getSafeValue(data.email)}
              </p>` : ''}
            
            ${data.website ? `
              <p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                ${getSafeValue(data.website)}
              </p>` : ''}
          </div>

          <!-- Summary -->
          ${data.summary ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #52525b; margin-bottom: 4px;">
                Summary
              </div>
              <div style="border: 1px solid #52525b; margin: 4px -16px;"></div>
              <div style="font-size: 12px; font-family: monospace; word-break: break-word; white-space: normal; margin-top: 8px;">
                ${getSafeValue(data.summary)}
              </div>
            </div>` : ''}

          <!-- Experience -->
          ${data.experience.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #52525b; margin-bottom: 4px;">
                Experience
              </div>
              <div style="border: 1px solid #52525b; margin: 4px -16px;"></div>
              ${data.experience.map((exp, i) => `
                <div style="width: 100%; margin-top: 8px;">
                  <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal; margin: 0;">
                    ${getSafeValue(exp.company ?? '')}
                  </p>
                  <p style="font-weight: 600; font-size: 12px; margin: 0;">
                    ${getSafeValue(exp.date ?? '')}
                  </p>
                </div>
              `).join('')}
            </div>` : ''}

          <!-- Education -->
          ${data.education.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #52525b; margin-bottom: 4px;">
                Education
              </div>
              <div style="border: 1px solid #52525b; margin: 4px -16px;"></div>
              ${data.education.map((edu, i) => `
                <div style="width: 100%; margin-top: 8px;">
                  <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal; margin: 0;">
                    ${getSafeValue(edu.name ?? '')}
                  </p>
                  <p style="font-weight: 600; font-size: 12px; margin: 0;">
                    ${getSafeValue(edu.date ?? '')}
                  </p>
                </div>
              `).join('')}
            </div>` : ''}

          <!-- Certifications -->
          ${data.certifications.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #52525b; margin-bottom: 4px;">
                Certifications
              </div>
              <div style="border: 1px solid #52525b; margin: 4px -16px;"></div>
              ${data.certifications.map((cert, i) => `
                <div style="width: 100%; margin-top: 8px;">
                  <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal; margin: 0;">
                    ${getSafeValue(cert.name ?? '')}
                  </p>
                  <p style="font-weight: 600; font-size: 12px; margin: 0;">
                    ${getSafeValue(cert.date ?? '')}
                  </p>
                </div>
              `).join('')}
            </div>` : ''}

          <!-- Languages -->
          ${data.languages.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #52525b; margin-bottom: 4px;">
                Languages
              </div>
              <div style="border: 1px solid #52525b; margin: 4px -16px;"></div>
              ${data.languages.map((lang, i) => {
                const level = lang.level ?? 0;
                return `
                  <div style="width: 100%; margin-top: 8px;">
                    <div style="display: flex; gap: 4px; margin-bottom: 4px;">
                      ${Array.from({ length: 6 }).map((_, idx) => {
                        return idx < level
                          ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#52525b"><circle cx="12" cy="12" r="6"/></svg>`
                          : `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52525b"><circle cx="12" cy="12" r="5"/></svg>`;
                      }).join('')}
                    </div>
                    <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal; margin: 0;">
                      ${getSafeValue(lang.name ?? '')}
                    </p>
                  </div>
                `;
              }).join('')}
            </div>` : ''}
        </div>
      </body>
    </html>
  `;
}

/* ---------- Onyx ---------- */
function generateOnyxTemplate(data: Required<FormValues>): string {
  return `
    <html>
      <head>
        ${baseHead()}
      </head>
      <body style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial; color: #18181b; background: #fff; padding: 16px;">
        <div style="width: 750px; margin: 0 auto; margin-bottom: 48px; color: #18181b; padding: 16px;">

          <!-- Fullname -->
          <div style="margin-bottom: 8px;">
            <p style="font-weight: 600; font-size: 20px; overflow-x: auto; margin: 0;">
              ${getSafeValue(data.fullname)}
            </p>
          </div>

          <!-- Contact -->
          <div style="display: flex; gap: 16px; overflow-x: auto; flex-wrap: wrap;">
            ${data.location ? `
              <p style="display: flex; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px; white-space: nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                ${getSafeValue(data.location)}
              </p>` : ''}
            
            ${data.phone ? `
              <p style="display: flex; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px; white-space: nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                ${getSafeValue(data.phone)}
              </p>` : ''}
            
            ${data.email ? `
              <p style="display: flex; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px; white-space: nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                ${getSafeValue(data.email)}
              </p>` : ''}
            
            ${data.website ? `
              <p style="display: flex; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px; white-space: nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                ${getSafeValue(data.website)}
              </p>` : ''}
          </div>

          ${data.fullname ? `<div style="border: 1px solid #e11d48; margin: 4px -16px;"></div>` : ''}

          <!-- Summary -->
          ${data.summary ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="font-size: 12px; font-weight: 600; color: #e11d48; margin-bottom: 8px;">Summary</div>
              <div style="font-size: 12px; font-family: monospace; word-break: break-word; white-space: normal;">
                ${getSafeValue(data.summary)}
              </div>
            </div>` : ''}

          <!-- Experience -->
          ${data.experience.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="font-size: 12px; font-weight: 600; color: #e11d48;">Experience</div>
              ${data.experience.map((exp, i) => `
                <div>
                  <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 16px;">
                    <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal;">${getSafeValue(exp.company ?? '')}</p>
                    <p style="font-weight: 600; font-size: 14px;">${getSafeValue(exp.date ?? '')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="height: 0.3px; background: #e11d48; border-radius: 9999px; width: 100%; opacity: 0.1; margin: 16px 0;"></div>
          ` : ''}

          <!-- Education -->
          ${data.education.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="font-size: 12px; font-weight: 600; color: #e11d48;">Education</div>
              ${data.education.map((edu, i) => `
                <div style="overflow-x: auto;">
                  <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 16px;">
                    <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal;">${getSafeValue(edu.name ?? '')}</p>
                    <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal;">${getSafeValue(edu.date ?? '')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="height: 0.3px; background: #e11d48; border-radius: 9999px; width: 100%; opacity: 0.1; margin: 16px 0;"></div>
          ` : ''}

          <!-- Certifications -->
          ${data.certifications.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="font-size: 12px; font-weight: 600; color: #e11d48;">Certifications</div>
              ${data.certifications.map((cert, i) => `
                <div style="overflow-x: auto;">
                  <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 16px;">
                    <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal;">${getSafeValue(cert.name ?? '')}</p>
                    <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal;">${getSafeValue(cert.date ?? '')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="height: 0.3px; background: #e11d48; border-radius: 9999px; width: 100%; opacity: 0.1; margin: 16px 0;"></div>
          ` : ''}

          <!-- Languages -->
          ${data.languages.length ? `
            <div style="width: 100%; margin-top: 16px;">
              <div style="font-size: 12px; font-weight: 600; color: #e11d48;">Languages</div>
              ${data.languages.map((lang, i) => `
                <div style="overflow-x: auto; gap: 16px;">
                  <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin-top: 8px; gap: 16px;">
                    <p style="font-weight: 600; font-size: 14px; word-break: break-word; white-space: normal;">${getSafeValue(lang.name ?? '')}</p>
                    <div style="display: flex; gap: 4px;">
                      ${Array.from({ length: 6 }).map((_, idx) => {
                        const level = lang.level ?? 0;
                        return idx < level 
                          ? `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#e11d48"><circle cx="12" cy="12" r="6"/></svg>`
                          : `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2"><circle cx="12" cy="12" r="5"/></svg>`;
                      }).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

        </div>
      </body>
    </html>
  `;
}

/* ---------- Bronzor ---------- */
function generateBronzorTemplate(data: Required<FormValues>): string {
  const LevelMap: Record<number, string> = {
    1: "Beginner",
    2: "Elementary",
    3: "Intermediate",
    4: "Upper Intermediate",
    5: "Advanced",
    6: "Proficient"
  };

  return `
  <html>
    <head>
      ${baseHead()}
    </head>
    <body style="font-family: Georgia, 'Times New Roman', Times, serif; color: #18181b; background: #fff; padding: 16px;">
      <div class="content-container" style=" margin: 0 auto; margin-bottom: 32px;">
        <!-- Fullname -->
        <div style="margin-bottom: 8px;">
          <p style="font-weight: 600; display: flex; justify-content: center; align-items: center; font-size: 20px; line-height: 28px; overflow-x: auto;">
            ${getSafeValue(data.fullname)}
          </p>
        </div>

        <!-- Contact -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 16px; overflow: auto; flex-wrap: wrap;">
          ${data.location ? `<p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${getSafeValue(data.location)}
          </p>` : ''}
          
          ${data.phone ? `<p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            ${getSafeValue(data.phone)}
          </p>` : ''}
          
          ${data.email ? `<p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            ${getSafeValue(data.email)}
          </p>` : ''}
          
          ${data.website ? `<p style="display: flex; justify-content: center; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
            ${getSafeValue(data.website)}
          </p>` : ''}
        </div>

        <!-- Summary -->
        ${data.summary ? `
          <div style="margin-top: 16px;">
            <div style="height: 1px; background-color: #0e7490; margin: 4px 0; opacity: 0.3;"></div>
            <div style="display: flex; justify-content: space-between; padding:4px; ">
              <div style="   font-size: 14px; font-weight: 700;">Summary</div>
              <div style=" width:620px; font-size: 12px; font-family: monospace; word-break: break-word; white-space: normal;" class="wide-column">
                ${getSafeValue(data.summary)}
              </div>
            </div>
          </div>` : ''}

        <!-- Experience -->
       ${data.experience.length ? `
  <div style="margin-top: 16px;">
    <div style="height: 1px; background-color: #0e7490; margin: 4px 0; opacity: 0.3;"></div>
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <!-- Başlık -->
      <div style="font-size: 14px; font-weight: 700; min-width: 100px;">Experience</div>

      <!-- İçerik -->
      <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
        ${data.experience.map(exp => `
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <p style="font-weight: 700; font-size: 14px; word-break: break-word; white-space: normal; flex: 1; margin: 0;">
              ${getSafeValue(exp.company ?? "")}
            </p>
            <p style="font-weight: 700; font-size: 12px; margin: 0 0 0 8px;">
              ${getSafeValue(exp.date ?? "")}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>` : ''}

       <!-- Education -->
${data.education.length ? `
  <div style="margin-top: 16px;">
    <div style="height: 1px; background-color: #0e7490; margin: 4px 0; opacity: 0.3;"></div>
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <div style="font-size: 14px; font-weight: 700; min-width: 100px;">Education</div>
      <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
        ${data.education.map(edu => `
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <p style="font-weight: 700; font-size: 14px; word-break: break-word; white-space: normal; flex: 1; margin: 0;">
              ${getSafeValue(edu.name ?? "")}
            </p>
            <p style="font-weight: 700; font-size: 12px; margin: 0 0 0 8px;">
              ${getSafeValue(edu.date ?? "")}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>` : ''}

<!-- Certifications -->
${data.certifications.length ? `
  <div style="margin-top: 16px;">
    <div style="height: 1px; background-color: #0e7490; margin: 4px 0; opacity: 0.3;"></div>
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <div style="font-size: 14px; font-weight: 700; min-width: 100px;">Certifications</div>
      <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
        ${data.certifications.map(cert => `
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <p style="font-weight: 700; font-size: 14px; word-break: break-word; white-space: normal; flex: 1; margin: 0;">
              ${getSafeValue(cert.name ?? "")}
            </p>
            <p style="font-weight: 700; font-size: 12px; margin: 0 0 0 8px;">
              ${getSafeValue(cert.date ?? "")}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>` : ''}

<!-- Languages -->
${data.languages.length ? `
  <div style="margin-top: 16px;">
    <div style="height: 1px; background-color: #0e7490; margin: 4px 0; opacity: 0.3;"></div>
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <div style="font-size: 14px; font-weight: 700; min-width: 100px;">Languages</div>
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; flex: 1;">
        ${data.languages.map(lang => `
          <div style="display: flex; flex-direction: column;">
            <p style="font-weight: 700; font-size: 14px; word-break: break-word; white-space: normal; margin:0;">
              ${getSafeValue(lang.name ?? "")}
            </p>
            <p style="font-weight: 600; font-size: 12px; margin:2px 0 0 0;">
              ${LevelMap[lang.level ?? 1]}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  </div>` : ''}
      </div>
    </body>
  </html>
  `;
}

