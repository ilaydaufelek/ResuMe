import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

// Frontend'deki type'ları buraya taşıyalım
export type ExperienceItem = { company?: string; date?: string };
export type EducationItem = { name?: string; date?: string };
export type CertificationItem = { name?: string; date?: string };
export type LanguageItem = { name?: string; level?: number };

export type FormValues = {
  fullname: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  templateType?: string;
};

export async function POST(req: Request) {
  try {
    const data: FormValues = await req.json();
    
    // Template seçimine göre HTML oluştur
    let html = '';
    
    switch (data.templateType) {
      case 'kakuna':
        html = generateKakunaTemplate(data);
        break;
      case 'onyx':
        html = generateOnyxTemplate(data);
        break;
      case 'bronzor':
        html = generateBronzorTemplate(data);
        break;
      default:
        html = generateKakunaTemplate(data);
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8 = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();

    const pdfBuffer = Buffer.from(pdfUint8);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cv-${data.templateType || 'kakuna'}.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

// Helper function for HTML escaping
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper function for safe value access
function getSafeValue(value: string | undefined): string {
  return value ? escapeHtml(value) : '';
}

// Kakuna Template
function generateKakunaTemplate(data: FormValues): string {
  return `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', sans-serif;
            color: #27272a;
            width: 100%;
            padding: 8px;
            margin: 0;
            background: white;
          }
          
          .container {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .fullname-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
          }
          
          .fullname {
            font-weight: 600;
            font-size: 20px;
            line-height: 24px;
            text-align: center;
          }
          
          .contact-info {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 16px;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            font-size: 12px;
            text-decoration: underline;
            margin-top: 4px;
          }
          
          .contact-icon {
            width: 12px;
            height: 12px;
            margin-right: 4px;
          }
          
          .section {
            width: 100%;
            margin-top: 16px;
          }
          
          .section-title {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            color: #52525b;
            text-transform: uppercase;
          }
          
          .section-divider {
            border-top: 1px solid #52525b;
            margin: 4px -8px;
          }
          
          .section-content {
            font-size: 12px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            word-break: break-word;
            white-space: normal;
          }
          
          .item {
            margin-bottom: 8px;
            width: 100%;
          }
          
          .item-title {
            font-weight: 600;
            font-size: 14px;
            word-break: break-word;
            white-space: normal;
          }
          
          .item-date {
            font-weight: 600;
            font-size: 12px;
          }
          
          .language-item {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }
          
          .language-name {
            font-weight: 600;
            font-size: 14px;
            word-break: break-word;
            white-space: normal;
          }
          
          .language-level {
            display: flex;
            gap: 4px;
          }
          
          .level-icon {
            width: 12px;
            height: 12px;
          }
          
          .filled-icon {
            fill: currentColor;
          }
          
          .empty-icon {
            stroke: currentColor;
            fill: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Full Name -->
          <div class="fullname-container">
            <p class="fullname">${getSafeValue(data.fullname)}</p>
          </div>
          
          <!-- Contact Info -->
          <div class="contact-info">
            ${data.location ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${getSafeValue(data.location)}
              </div>
            ` : ''}
            
            ${data.phone ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                ${getSafeValue(data.phone)}
              </div>
            ` : ''}
            
            ${data.email ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                ${getSafeValue(data.email)}
              </div>
            ` : ''}
            
            ${data.website ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                ${getSafeValue(data.website)}
              </div>
            ` : ''}
          </div>
          
          <!-- Summary -->
          ${data.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div class="section-divider"></div>
              <div class="section-content">${getSafeValue(data.summary)}</div>
            </div>
          ` : ''}
          
          <!-- Experience -->
          ${data.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Experience</div>
              <div class="section-divider"></div>
              ${data.experience.map((exp, i) => `
                <div class="item" key="${i}">
                  <p class="item-title">${getSafeValue(exp.company)}</p>
                  <p class="item-date">${getSafeValue(exp.date)}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <!-- Education -->
          ${data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              <div class="section-divider"></div>
              ${data.education.map((edu, i) => `
                <div class="item" key="${i}">
                  <p class="item-title">${getSafeValue(edu.name)}</p>
                  <p class="item-date">${getSafeValue(edu.date)}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <!-- Certifications -->
          ${data.certifications.length > 0 ? `
            <div class="section">
              <div class="section-title">Certifications</div>
              <div class="section-divider"></div>
              ${data.certifications.map((cert, i) => `
                <div class="item" key="${i}">
                  <p class="item-title">${getSafeValue(cert.name)}</p>
                  <p class="item-date">${getSafeValue(cert.date)}</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <!-- Languages -->
          ${data.languages.length > 0 ? `
            <div class="section">
              <div class="section-title">Languages</div>
              <div class="section-divider"></div>
              ${data.languages.map((lang, i) => {
                const level = lang.level || 0;
                return `
                  <div class="language-item" key="${i}">
                    <p class="language-name">${getSafeValue(lang.name)}</p>
                    <div class="language-level">
                      ${Array.from({ length: 6 }).map((_, idx) => {
                        if (idx < level) {
                          return `
                            <svg class="level-icon filled-icon" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          `;
                        } else {
                          return `
                            <svg class="level-icon empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          `;
                        }
                      }).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}

// Onyx Template
function generateOnyxTemplate(data: FormValues): string {
  return `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', sans-serif;
            color: #27272a;
            width: 100%;
            height: 100%;
            padding: 8px;
            margin: 0;
            background: white;
          }
          
          .container {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          
          .fullname-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }
          
          .fullname {
            font-weight: 600;
            font-size: 20px;
            line-height: 24px;
          }
          
          .contact-info {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            gap: 16px;
            overflow-x: auto;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            font-size: 12px;
            text-decoration: underline;
            margin-top: 4px;
            white-space: nowrap;
          }
          
          .contact-icon {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            color: #e11d48;
          }
          
          .main-divider {
            border-top: 1px solid #e11d48;
            margin: 4px -8px;
          }
          
          .thin-divider {
            height: 0.3px;
            background-color: #e11d48;
            border-radius: 9999px;
            width: 100%;
            opacity: 0.1;
            margin: 16px 0;
          }
          
          .section {
            width: 100%;
            margin-top: 16px;
          }
          
          .section-title {
            font-size: 12px;
            font-weight: 600;
            color: #e11d48;
            margin-bottom: 8px;
          }
          
          .section-content {
            font-size: 12px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            word-break: break-word;
            white-space: normal;
          }
          
          .experience-item {
            width: 100%;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .item-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-top: 8px;
          }
          
          .item-title {
            font-weight: 600;
            font-size: 14px;
            word-break: break-word;
            white-space: normal;
            flex: 1;
          }
          
          .item-date {
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
          }
          
          .language-item {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin-top: 8px;
            margin-bottom: 8px;
          }
          
          .language-name {
            font-weight: 600;
            font-size: 14px;
            word-break: break-word;
            white-space: normal;
            flex: 1;
          }
          
          .language-level {
            display: flex;
            gap: 4px;
          }
          
          .level-icon {
            width: 12px;
            height: 12px;
            color: #e11d48;
          }
          
          .filled-icon {
            fill: currentColor;
          }
          
          .empty-icon {
            stroke: currentColor;
            fill: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Full Name -->
          <div class="fullname-container">
            <p class="fullname">${getSafeValue(data.fullname)}</p>
          </div>
          
          <!-- Contact Info -->
          <div class="contact-info">
            ${data.location ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${getSafeValue(data.location)}
              </div>
            ` : ''}
            
            ${data.phone ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                ${getSafeValue(data.phone)}
              </div>
            ` : ''}
            
            ${data.email ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                ${getSafeValue(data.email)}
              </div>
            ` : ''}
            
            ${data.website ? `
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                ${getSafeValue(data.website)}
              </div>
            ` : ''}
          </div>
          
          <!-- Main Divider -->
          <div class="main-divider"></div>
          
          <!-- Summary -->
          ${data.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div class="section-content">${getSafeValue(data.summary)}</div>
            </div>
          ` : ''}
          
          <!-- Experience -->
          ${data.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${data.experience.map((exp, i) => `
                <div class="experience-item" key="${i}">
                  <div class="item-row">
                    <p class="item-title">${getSafeValue(exp.company)}</p>
                    <p class="item-date">${getSafeValue(exp.date)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="thin-divider"></div>
          ` : ''}
          
          <!-- Education -->
          ${data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${data.education.map((edu, i) => `
                <div class="experience-item" key="${i}">
                  <div class="item-row">
                    <p class="item-title">${getSafeValue(edu.name)}</p>
                    <p class="item-date">${getSafeValue(edu.date)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="thin-divider"></div>
          ` : ''}
          
          <!-- Certifications -->
          ${data.certifications.length > 0 ? `
            <div class="section">
              <div class="section-title">Certifications</div>
              ${data.certifications.map((cert, i) => `
                <div class="experience-item" key="${i}">
                  <div class="item-row">
                    <p class="item-title">${getSafeValue(cert.name)}</p>
                    <p class="item-date">${getSafeValue(cert.date)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="thin-divider"></div>
          ` : ''}
          
          <!-- Languages -->
          ${data.languages.length > 0 ? `
            <div class="section">
              <div class="section-title">Languages</div>
              ${data.languages.map((lang, i) => {
                const level = lang.level || 0;
                return `
                  <div class="language-item" key="${i}">
                    <p class="language-name">${getSafeValue(lang.name)}</p>
                    <div class="language-level">
                      ${Array.from({ length: 6 }).map((_, idx) => {
                        if (idx < level) {
                          return `
                            <svg class="level-icon filled-icon" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          `;
                        } else {
                          return `
                            <svg class="level-icon empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          `;
                        }
                      }).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}

// Bronzor Template
function generateBronzorTemplate(data: FormValues): string {
  return `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&display=swap');
          
          body { 
            font-family: 'Georgia', serif; 
            padding: 25px; 
            background: #ffffff;
            color: #2c3e50;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .fullname { 
            font-weight: bold; 
            font-size: 32px; 
            text-align: center;
            color: #2c5282;
            margin-bottom: 15px;
          }
          
          .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
          }
          
          .contact-item {
            text-align: center;
            font-size: 13px;
          }
          
          .section {
            margin-bottom: 25px;
          }
          
          .section-title {
            font-weight: bold;
            font-size: 18px;
            color: #2c5282;
            border-bottom: 2px solid #2c5282;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          
          .item {
            margin-bottom: 10px;
          }
          
          .item-title {
            font-weight: bold;
            font-size: 16px;
          }
          
          .item-date {
            font-size: 14px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="fullname">${getSafeValue(data.fullname)}</div>
          
          <div class="contact-grid">
            ${data.location ? `<div class="contact-item">📍 ${getSafeValue(data.location)}</div>` : ''}
            ${data.phone ? `<div class="contact-item">📞 ${getSafeValue(data.phone)}</div>` : ''}
            ${data.email ? `<div class="contact-item">✉️ ${getSafeValue(data.email)}</div>` : ''}
            ${data.website ? `<div class="contact-item">🔗 ${getSafeValue(data.website)}</div>` : ''}
          </div>
          
          ${data.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div>${getSafeValue(data.summary)}</div>
            </div>
          ` : ''}
          
          ${data.experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${data.experience.map((exp, i) => `
                <div class="item" key="${i}">
                  <div class="item-title">${getSafeValue(exp.company)}</div>
                  <div class="item-date">${getSafeValue(exp.date)}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${data.education.map((edu, i) => `
                <div class="item" key="${i}">
                  <div class="item-title">${getSafeValue(edu.name)}</div>
                  <div class="item-date">${getSafeValue(edu.date)}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}