const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();

const URL = 'https://news.ycombinator.com/';


async function printPdfFromUrl(pdfUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL, {
    waitUntil: "networkidle2"
  });
  await page.setViewport({ width: 1680, height: 1050 });
  
  const pdf = await page.pdf({
    path: pdfUrl,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: '38px',
      right: '38px',
      bottom: '38px',
      left: '38px',
    }
  });

  await browser.close();
  return pdf;
}

app.get('/printPdf', async (req, res) => {
  const pdfUrl = path.join(__dirname, 'public', `Document_${new Date().toISOString()}.pdf`);
  try {
    const pdf = await printPdfFromUrl(pdfUrl);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdf.length
    });
    res.sendFile(pdfUrl);
  } catch(e) {
    res.status(500);
    res.send(e);
  }
 
});

app.listen(3000, () => console.log(`Server running on port 3000`));
