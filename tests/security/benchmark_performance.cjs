/**
 * LS PDF - Performance & Large Document Stress Benchmark
 * Evaluates Small (~50 KB), Medium (~500 KB), and Large (~2 MB image-heavy) PDFs.
 */

const { PDFDocument, rgb } = require('pdf-lib');
const { encryptPDF } = require('@pdfsmaller/pdf-encrypt');
const { decryptPDF } = require('@pdfsmaller/pdf-decrypt');

// Generate 500x500 synthetic PNG in memory
function generateSyntheticImageBytes(width, height) {
  // Use raw uncompressed dummy data inside a valid PNG header or repetitive pattern
  const totalPixels = width * height;
  const rawBytes = new Uint8Array(totalPixels * 4);
  for (let i = 0; i < totalPixels; i++) {
    rawBytes[i * 4] = (i * 7) % 256;     // R
    rawBytes[i * 4 + 1] = (i * 13) % 256; // G
    rawBytes[i * 4 + 2] = (i * 19) % 256; // B
    rawBytes[i * 4 + 3] = 255;            // A
  }
  return rawBytes;
}

async function runBenchmark() {
  console.log('================================================================');
  console.log('LS PDF SECURITY: PERFORMANCE & LARGE DOCUMENT BENCHMARK');
  console.log('================================================================\n');

  const results = [];

  // 1. Small PDF (~50 KB, 5 pages of text & paragraphs)
  {
    console.log('Generating Small PDF (5 pages, multi-paragraph text)...');
    const doc = await PDFDocument.create();
    for (let p = 1; p <= 5; p++) {
      const page = doc.addPage([595, 842]); // A4
      page.drawText(`Confidential Audit Report - Section ${p}`, { x: 50, y: 800, size: 16 });
      for (let line = 0; line < 35; line++) {
        page.drawText(`Line ${line}: Standard financial statement disclosure paragraph detailing transaction flows and balance sheet verifications.`, {
          x: 50,
          y: 760 - (line * 20),
          size: 9
        });
      }
    }
    const rawBytes = await doc.save();
    console.log(`Small PDF generated: ${(rawBytes.length / 1024).toFixed(2)} KB`);

    const memBefore = process.memoryUsage().heapUsed;
    const t0 = performance.now();
    const encBytes = await encryptPDF(rawBytes, 'BenchmarkPass123!');
    const encDuration = performance.now() - t0;

    const t1 = performance.now();
    const decBytes = await decryptPDF(encBytes, 'BenchmarkPass123!');
    const decDuration = performance.now() - t1;
    const memAfter = process.memoryUsage().heapUsed;

    results.push({
      tier: 'Small PDF (5 Pages)',
      inputSizeKb: (rawBytes.length / 1024).toFixed(2),
      encSizeKb: (encBytes.length / 1024).toFixed(2),
      decSizeKb: (decBytes.length / 1024).toFixed(2),
      encDurationMs: encDuration.toFixed(1),
      decDurationMs: decDuration.toFixed(1),
      heapDeltaMb: ((memAfter - memBefore) / (1024 * 1024)).toFixed(2)
    });
  }

  // 2. Medium PDF (~500 KB, 20 pages with dense vector graphics and tables)
  {
    console.log('Generating Medium PDF (20 pages, dense vector drawings & data tables)...');
    const doc = await PDFDocument.create();
    for (let p = 1; p <= 20; p++) {
      const page = doc.addPage([595, 842]);
      page.drawText(`Enterprise Asset Ledger 2026 - Sheet ${p}`, { x: 50, y: 800, size: 14 });
      for (let r = 0; r < 40; r++) {
        const y = 770 - (r * 18);
        page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
        page.drawText(`Row ${r + 1} | Asset ID: AST-${p}-${r} | Ledger Balance: $${(r * 1234.56).toFixed(2)} | Status: AUDITED`, {
          x: 55,
          y: y + 3,
          size: 8
        });
      }
    }
    const rawBytes = await doc.save();
    console.log(`Medium PDF generated: ${(rawBytes.length / 1024).toFixed(2)} KB`);

    const memBefore = process.memoryUsage().heapUsed;
    const t0 = performance.now();
    const encBytes = await encryptPDF(rawBytes, 'MediumBenchmarkSecret!');
    const encDuration = performance.now() - t0;

    const t1 = performance.now();
    const decBytes = await decryptPDF(encBytes, 'MediumBenchmarkSecret!');
    const decDuration = performance.now() - t1;
    const memAfter = process.memoryUsage().heapUsed;

    results.push({
      tier: 'Medium PDF (20 Pages)',
      inputSizeKb: (rawBytes.length / 1024).toFixed(2),
      encSizeKb: (encBytes.length / 1024).toFixed(2),
      decSizeKb: (decBytes.length / 1024).toFixed(2),
      encDurationMs: encDuration.toFixed(1),
      decDurationMs: decDuration.toFixed(1),
      heapDeltaMb: ((memAfter - memBefore) / (1024 * 1024)).toFixed(2)
    });
  }

  // 3. Large Image-Heavy PDF (~1.5MB - 2MB, 10 pages with high-res PNG images)
  {
    console.log('Generating Large Image-Heavy PDF (10 pages with embedded raster images)...');
    // Generate valid PNG buffer using a 200x200 canvas/buffer
    const doc = await PDFDocument.create();
    // Create an image using sharp or synthetic PNG
    const sharp = require('sharp');
    const crypto = require('crypto');
    // Generate 1.2 MB uncompressed random noise buffer to prevent flate compression shrinking
    const randomNoise = crypto.randomBytes(600 * 600 * 3);
    const imgBuffer = await sharp(randomNoise, {
      raw: { width: 600, height: 600, channels: 3 }
    }).jpeg({ quality: 90 }).toBuffer();

    const embeddedJpg = await doc.embedJpg(imgBuffer);

    for (let p = 1; p <= 10; p++) {
      const page = doc.addPage([595, 842]);
      page.drawText(`High-Resolution Asset Page ${p}`, { x: 50, y: 800, size: 16 });
      page.drawImage(embeddedJpg, { x: 97, y: 300, width: 400, height: 400 });
      page.drawText(`Image digest verification block for asset #${p}. Cryptographic hash: SHA256-verified.`, { x: 50, y: 250, size: 10 });
    }
    const rawBytes = await doc.save();
    console.log(`Large PDF generated: ${(rawBytes.length / 1024).toFixed(2)} KB`);

    const memBefore = process.memoryUsage().heapUsed;
    const t0 = performance.now();
    const encBytes = await encryptPDF(rawBytes, 'LargeDocumentSecret2026!');
    const encDuration = performance.now() - t0;

    const t1 = performance.now();
    const decBytes = await decryptPDF(encBytes, 'LargeDocumentSecret2026!');
    const decDuration = performance.now() - t1;
    const memAfter = process.memoryUsage().heapUsed;

    results.push({
      tier: 'Large Image PDF (10 Pages, Embedded Raster)',
      inputSizeKb: (rawBytes.length / 1024).toFixed(2),
      encSizeKb: (encBytes.length / 1024).toFixed(2),
      decSizeKb: (decBytes.length / 1024).toFixed(2),
      encDurationMs: encDuration.toFixed(1),
      decDurationMs: decDuration.toFixed(1),
      heapDeltaMb: ((memAfter - memBefore) / (1024 * 1024)).toFixed(2)
    });
  }

  console.log('\n--- PERFORMANCE BENCHMARK RESULTS ---');
  console.table(results);
}

runBenchmark().catch(err => {
  console.error(err);
  process.exit(1);
});
