import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapor</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: white; color: #171717; }
        </style>
      </head>
      <body>
        <h1>${data.fullname || ''}</h1>
        <p>Email: ${data.email || ''}</p>
        <p>Phone: ${data.phone || ''}</p>
        <p>Location: ${data.location || ''}</p>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  // Buffer'ı Uint8Array'e çeviriyoruz
  const uint8Array = new Uint8Array(pdfBuffer);

  return new Response(uint8Array, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=rapor.pdf`,
    },
  });
}
