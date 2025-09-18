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
        <style>
          body { 
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, "Apple Color Emoji","Segoe UI Emoji";
            color: #27272a; width: 100%; padding: 8px; background: #fff;
          }
          .container { display: flex; flex-direction: column; gap: 8px; }
          .fullname { font-weight: 600; font-size: 20px; line-height: 24px; text-align: center; }
          .contact-info { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px; }
          .contact-item { display: flex; align-items: center; font-size: 12px; text-decoration: underline; margin-top: 4px; }
          .section { width: 100%; margin-top: 16px; }
          .section-title { display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:#52525b; text-transform:uppercase; }
          .section-divider { border-top: 1px solid #52525b; margin: 4px -8px; }
          .section-content { font-size:12px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; word-break: break-word; }
          .item { margin-bottom: 8px; }
          .item-title { font-weight:600; font-size:14px; word-break: break-word; }
          .item-date { font-weight:600; font-size:12px; }
          .language-item { display:flex; align-items:center; justify-content:space-between; gap:8px; }
          .language-name { font-weight:600; font-size:14px; word-break: break-word; }
          .language-level { display:flex; gap:4px; }
          .level-icon { width:12px; height:12px; }
          .filled-icon { fill: currentColor; }
          .empty-icon { stroke: currentColor; fill: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="fullname">${getSafeValue(data.fullname)}</p>

          <div class="contact-info">
            ${data.location ? `
  <div class="contact-item">
    <svg xmlns="http://www.w3.org/2000/svg" class="level-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
    ${getSafeValue(data.location)}
  </div>` : ""}

${data.phone ? `
  <div class="contact-item">
    <svg xmlns="http://www.w3.org/2000/svg" class="level-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M6.62 10.79a15.464 15.464 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.59a1 1 0 01-.25 1.02l-2.2 2.18z"/>
    </svg>
    ${getSafeValue(data.phone)}
  </div>` : ""}

${data.email ? `
  <div class="contact-item">
    <svg xmlns="http://www.w3.org/2000/svg" class="level-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
    ${getSafeValue(data.email)}
  </div>` : ""}

${data.website ? `
  <div class="contact-item">
    <svg xmlns="http://www.w3.org/2000/svg" class="level-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18  c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2 v6h-2zm0 8h2v2h-2z"/> </svg>
               
             
              
              
   
    ${getSafeValue(data.website)}
  </div>` : ""}
          </div>

          ${data.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div class="section-divider"></div>
              <div class="section-content">${getSafeValue(data.summary)}</div>
            </div>` : ""}

          ${data.experience.length ? `
            <div class="section">
              <div class="section-title">Experience</div>
              <div class="section-divider"></div>
              ${data.experience.map((exp) => `
                <div class="item">
                  <p class="item-title">${getSafeValue(exp.company ?? "")}</p>
                  <p class="item-date">${getSafeValue(exp.date ?? "")}</p>
                </div>`).join("")}
            </div>` : ""}

          ${data.education.length ? `
            <div class="section">
              <div class="section-title">Education</div>
              <div class="section-divider"></div>
              ${data.education.map((edu) => `
                <div class="item">
                  <p class="item-title">${getSafeValue(edu.name ?? "")}</p>
                  <p class="item-date">${getSafeValue(edu.date ?? "")}</p>
                </div>`).join("")}
            </div>` : ""}

          ${data.certifications.length ? `
            <div class="section">
              <div class="section-title">Certifications</div>
              <div class="section-divider"></div>
              ${data.certifications.map((cert) => `
                <div class="item">
                  <p class="item-title">${getSafeValue(cert.name ?? "")}</p>
                  <p class="item-date">${getSafeValue(cert.date ?? "")}</p>
                </div>`).join("")}
            </div>` : ""}

          ${data.languages.length ? `
            <div class="section">
              <div class="section-title">Languages</div>
              <div class="section-divider"></div>
              ${data.languages.map((lang) => {
                const level = Math.max(0, Math.min(6, lang.level ?? 0));
                return `
                  <div class="language-item">
                    <p class="language-name">${getSafeValue(lang.name ?? "")}</p>
                    <div class="language-level">
                      ${Array.from({ length: 6 }).map((_, idx) =>
                        idx < level
                          ? `<svg class="level-icon filled-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>`
                          : `<svg class="level-icon empty-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`
                      ).join("")}
                    </div>
                  </div>`;
              }).join("")}
            </div>` : ""}
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
        <style>
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial; color:#27272a; padding:8px; background:#fff; }
          .container { display:flex; flex-direction:column; gap:8px; }
          .fullname { font-weight:600; font-size:20px; line-height:24px; }
          .contact-info { display:flex; gap:16px; overflow-x:auto; }
          .contact-item { display:flex; align-items:center; font-size:12px; text-decoration:underline; white-space:nowrap; }
          .main-divider { border-top:1px solid #e11d48; margin:4px -8px; }
          .thin-divider { height:.3px; background:#e11d48; border-radius:9999px; opacity:.1; margin:16px 0; }
          .section { margin-top:16px; }
          .section-title { font-size:12px; font-weight:600; color:#e11d48; margin-bottom:8px; }
          .section-content { font-size:12px; font-family: ui-monospace, Menlo, Monaco, Consolas, "Courier New", monospace; word-break:break-word; }
          .item-row { display:flex; justify-content:space-between; gap:16px; margin-top:8px; }
          .item-title { font-weight:600; font-size:14px; flex:1; word-break:break-word; }
          .item-date { font-weight:600; font-size:14px; white-space:nowrap; }
          .language-item { display:flex; justify-content:space-between; gap:16px; margin:8px 0; }
          .level-icon { width:12px; height:12px; color:#e11d48; }
          .filled-icon { fill: currentColor; }
          .empty-icon { stroke: currentColor; fill: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="fullname">${getSafeValue(data.fullname)}</p>

          <div class="contact-info">
            ${data.location ? `<div class="contact-item">📍 ${getSafeValue(data.location)}</div>` : ""}
            ${data.phone ? `<div class="contact-item">📞 ${getSafeValue(data.phone)}</div>` : ""}
            ${data.email ? `<div class="contact-item">✉️ ${getSafeValue(data.email)}</div>` : ""}
            ${data.website ? `<div class="contact-item">🔗 ${getSafeValue(data.website)}</div>` : ""}
          </div>

          <div class="main-divider"></div>

          ${data.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div class="section-content">${getSafeValue(data.summary)}</div>
            </div>` : ""}

          ${data.experience.length ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${data.experience.map((exp) => `
                <div class="item-row">
                  <p class="item-title">${getSafeValue(exp.company ?? "")}</p>
                  <p class="item-date">${getSafeValue(exp.date ?? "")}</p>
                </div>`).join("")}
            </div>
            <div class="thin-divider"></div>` : ""}

          ${data.education.length ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${data.education.map((edu) => `
                <div class="item-row">
                  <p class="item-title">${getSafeValue(edu.name ?? "")}</p>
                  <p class="item-date">${getSafeValue(edu.date ?? "")}</p>
                </div>`).join("")}
            </div>
            <div class="thin-divider"></div>` : ""}

          ${data.certifications.length ? `
            <div class="section">
              <div class="section-title">Certifications</div>
              ${data.certifications.map((cert) => `
                <div class="item-row">
                  <p class="item-title">${getSafeValue(cert.name ?? "")}</p>
                  <p class="item-date">${getSafeValue(cert.date ?? "")}</p>
                </div>`).join("")}
            </div>
            <div class="thin-divider"></div>` : ""}

          ${data.languages.length ? `
            <div class="section">
              <div class="section-title">Languages</div>
              ${data.languages.map((lang) => {
                const level = Math.max(0, Math.min(6, lang.level ?? 0));
                return `
                  <div class="language-item">
                    <p class="item-title">${getSafeValue(lang.name ?? "")}</p>
                    <div>
                      ${Array.from({ length: 6 }).map((_, idx) =>
                        idx < level
                          ? `<svg class="level-icon filled-icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
                          : `<svg class="level-icon empty-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`
                      ).join("")}
                    </div>
                  </div>`;
              }).join("")}
            </div>` : ""}
        </div>
      </body>
    </html>
  `;
}

/* ---------- Bronzor ---------- */
function generateBronzorTemplate(data: Required<FormValues>): string {
  return `
    <html>
      <head>
        ${baseHead()}
        <style>
          body { font-family: Georgia, "Times New Roman", Times, serif; padding:25px; background:#fff; color:#2c3e50; }
          .container { max-width:800px; margin:0 auto; }
          .fullname { font-weight:700; font-size:32px; text-align:center; color:#2c5282; margin-bottom:15px; }
          .contact-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-bottom:30px; }
          .contact-item { text-align:center; font-size:13px; }
          .section { margin-bottom:25px; }
          .section-title { font-weight:700; font-size:18px; color:#2c5282; border-bottom:2px solid #2c5282; padding-bottom:5px; margin-bottom:15px; }
          .item { margin-bottom:10px; }
          .item-title { font-weight:700; font-size:16px; }
          .item-date { font-size:14px; color:#666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="fullname">${getSafeValue(data.fullname)}</div>

          <div class="contact-grid">
            ${data.location ? `<div class="contact-item">📍 ${getSafeValue(data.location)}</div>` : ""}
            ${data.phone ? `<div class="contact-item">📞 ${getSafeValue(data.phone)}</div>` : ""}
            ${data.email ? `<div class="contact-item">✉️ ${getSafeValue(data.email)}</div>` : ""}
            ${data.website ? `<div class="contact-item">🔗 ${getSafeValue(data.website)}</div>` : ""}
          </div>

          ${data.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div>${getSafeValue(data.summary)}</div>
            </div>` : ""}

          ${data.experience.length ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${data.experience.map((exp) => `
                <div class="item">
                  <div class="item-title">${getSafeValue(exp.company ?? "")}</div>
                  <div class="item-date">${getSafeValue(exp.date ?? "")}</div>
                </div>`).join("")}
            </div>` : ""}

          ${data.education.length ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${data.education.map((edu) => `
                <div class="item">
                  <div class="item-title">${getSafeValue(edu.name ?? "")}</div>
                  <div class="item-date">${getSafeValue(edu.date ?? "")}</div>
                </div>`).join("")}
            </div>` : ""}
        </div>
      </body>
    </html>
  `;
}
