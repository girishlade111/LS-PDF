import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  homeSEO,
  mergeSEO,
  splitSEO,
  compressSEO,
  protectSEO,
  unlockSEO,
  rotateSEO,
  rearrangeSEO,
  pageNumbersSEO,
  watermarkSEO,
  metadataSEO,
  signatureSEO,
  grayscaleSEO,
  pdfToImageSEO,
  imageToPdfSEO,
  extractImagesSEO,
  pdfToTextSEO,
  repairSEO,
  aboutSEO,
  privacySEO,
  settingsSEO,
  ToolSEOData
} from '../src/utils/seoData';
import { TOOL_GUIDES, ToolGuideData } from '../src/utils/toolGuideData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error(`Error: Build template not found at ${TEMPLATE_PATH}. Run 'npm run build' first.`);
  process.exit(1);
}

const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

interface RouteConfig {
  path: string;
  slug?: string;
  seo: ToolSEOData;
}

const routes: RouteConfig[] = [
  { path: 'merge', slug: 'merge', seo: mergeSEO },
  { path: 'split', slug: 'split', seo: splitSEO },
  { path: 'compress', slug: 'compress', seo: compressSEO },
  { path: 'protect', slug: 'protect', seo: protectSEO },
  { path: 'unlock', slug: 'unlock', seo: unlockSEO },
  { path: 'rotate-pdf', slug: 'rotate-pdf', seo: rotateSEO },
  { path: 'rearrange-pdf', slug: 'rearrange-pdf', seo: rearrangeSEO },
  { path: 'page-numbers', slug: 'page-numbers', seo: pageNumbersSEO },
  { path: 'watermark', slug: 'watermark', seo: watermarkSEO },
  { path: 'metadata', slug: 'metadata', seo: metadataSEO },
  { path: 'signature', slug: 'signature', seo: signatureSEO },
  { path: 'grayscale', slug: 'grayscale', seo: grayscaleSEO },
  { path: 'pdf-to-image', slug: 'pdf-to-image', seo: pdfToImageSEO },
  { path: 'image-to-pdf', slug: 'image-to-pdf', seo: imageToPdfSEO },
  { path: 'extract-images', slug: 'extract-images', seo: extractImagesSEO },
  { path: 'pdf-to-text', slug: 'pdf-to-text', seo: pdfToTextSEO },
  { path: 'repair', slug: 'repair', seo: repairSEO },
  { path: 'about', seo: aboutSEO },
  { path: 'privacy', seo: privacySEO },
  { path: 'settings', seo: settingsSEO },
];

function generateBreadcrumbJsonLd(canonical: string): object {
  const url = new URL(canonical);
  const parts = url.pathname.split('/').filter(Boolean);
  const nameMap: Record<string, string> = {
    merge: 'Merge PDF',
    split: 'Split PDF',
    compress: 'Compress PDF',
    protect: 'Protect PDF',
    unlock: 'Unlock PDF',
    'rotate-pdf': 'Rotate PDF',
    'rearrange-pdf': 'Rearrange PDF',
    'page-numbers': 'Add Page Numbers',
    watermark: 'Watermark PDF',
    metadata: 'Edit Metadata',
    signature: 'Sign PDF',
    grayscale: 'Convert to Grayscale',
    'pdf-to-image': 'PDF to Image',
    'image-to-pdf': 'Image to PDF',
    'extract-images': 'Extract Images',
    'pdf-to-text': 'PDF to Text',
    repair: 'Repair PDF',
    about: 'About',
    privacy: 'Privacy Policy',
    settings: 'Settings',
  };

  const itemListElement = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${url.origin}/` },
  ];

  if (parts.length > 0) {
    parts.forEach((part, i) => {
      const name = nameMap[part] || part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      itemListElement.push({
        '@type': 'ListItem',
        position: i + 2,
        name,
        item: `${url.origin}/${parts.slice(0, i + 1).join('/')}`,
      });
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

function generateHeaderHtml(): string {
  return `
    <header class="border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" class="flex items-center gap-3">
          <div class="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-500/20">LS</div>
          <div>
            <span class="font-black text-gray-900 dark:text-white text-base tracking-tight block leading-tight">LS PDF</span>
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest block leading-none">Private &amp; In-Browser</span>
          </div>
        </a>
        <nav aria-label="Primary Navigation" class="flex items-center gap-6 text-xs font-bold text-gray-600 dark:text-zinc-400">
          <a href="/" class="hover:text-rose-500 transition-colors">Home</a>
          <a href="/about" class="hover:text-rose-500 transition-colors">About</a>
          <a href="/privacy" class="hover:text-rose-500 transition-colors">Privacy</a>
          <a href="/settings" class="hover:text-rose-500 transition-colors">Settings</a>
        </nav>
      </div>
    </header>
  `;
}

function generateFooterHtml(): string {
  return `
    <footer class="border-t border-gray-100 dark:border-white/5 bg-white dark:bg-zinc-950 py-12 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">Edit &amp; Organize</h4>
            <ul class="space-y-2 text-xs font-semibold text-gray-600 dark:text-zinc-400">
              <li><a href="/merge" class="hover:text-rose-500 transition-colors">Merge PDF</a></li>
              <li><a href="/split" class="hover:text-rose-500 transition-colors">Split PDF</a></li>
              <li><a href="/rotate-pdf" class="hover:text-rose-500 transition-colors">Rotate PDF</a></li>
              <li><a href="/rearrange-pdf" class="hover:text-rose-500 transition-colors">Rearrange PDF</a></li>
              <li><a href="/page-numbers" class="hover:text-rose-500 transition-colors">Page Numbers</a></li>
              <li><a href="/watermark" class="hover:text-rose-500 transition-colors">Watermark</a></li>
              <li><a href="/signature" class="hover:text-rose-500 transition-colors">Sign PDF</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">Security &amp; Privacy</h4>
            <ul class="space-y-2 text-xs font-semibold text-gray-600 dark:text-zinc-400">
              <li><a href="/protect" class="hover:text-rose-500 transition-colors">Protect PDF</a></li>
              <li><a href="/unlock" class="hover:text-rose-500 transition-colors">Unlock PDF</a></li>
              <li><a href="/metadata" class="hover:text-rose-500 transition-colors">Edit Metadata</a></li>
              <li><a href="/privacy" class="hover:text-rose-500 transition-colors">Privacy Specification</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">Convert &amp; Extract</h4>
            <ul class="space-y-2 text-xs font-semibold text-gray-600 dark:text-zinc-400">
              <li><a href="/pdf-to-image" class="hover:text-rose-500 transition-colors">PDF to Image</a></li>
              <li><a href="/image-to-pdf" class="hover:text-rose-500 transition-colors">Image to PDF</a></li>
              <li><a href="/extract-images" class="hover:text-rose-500 transition-colors">Extract Images</a></li>
              <li><a href="/pdf-to-text" class="hover:text-rose-500 transition-colors">PDF to Text (OCR)</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">Optimize &amp; Repair</h4>
            <ul class="space-y-2 text-xs font-semibold text-gray-600 dark:text-zinc-400">
              <li><a href="/compress" class="hover:text-rose-500 transition-colors">Compress PDF</a></li>
              <li><a href="/grayscale" class="hover:text-rose-500 transition-colors">Grayscale PDF</a></li>
              <li><a href="/repair" class="hover:text-rose-500 transition-colors">Repair PDF</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-4">Project &amp; Source</h4>
            <ul class="space-y-2 text-xs font-semibold text-gray-600 dark:text-zinc-400">
              <li><a href="/about" class="hover:text-rose-500 transition-colors">About LS PDF</a></li>
              <li><a href="/privacy" class="hover:text-rose-500 transition-colors">Privacy Policy</a></li>
              <li><a href="/settings" class="hover:text-rose-500 transition-colors">Settings &amp; Auto-Wipe</a></li>
              <li><a href="https://github.com/girishlade111/LS-PDF" target="_blank" rel="noopener noreferrer" class="hover:text-rose-500 transition-colors">GitHub Repository</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-100 dark:border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 dark:text-zinc-500">
          <p>&copy; 2026 LS PDF. 100% Client-Side In-Browser PDF Suite. Free &amp; Open Source under AGPL-3.0.</p>
          <p class="mt-2 sm:mt-0 font-medium">Built by <a href="https://ladestack.in" target="_blank" rel="noopener noreferrer" class="hover:text-rose-500 transition-colors">Girish Lade</a></p>
        </div>
      </div>
    </footer>
  `;
}

function generateHomeBodyHtml(): string {
  const toolList = Object.values(TOOL_GUIDES);
  const toolsHtml = toolList
    .map(
      (tool) => `
      <article class="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all shadow-sm">
        <a href="/${tool.slug}" class="block group">
          <h3 class="text-lg font-black text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors mb-2">${tool.title}</h3>
          <p class="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">${tool.summary}</p>
        </a>
      </article>
    `
    )
    .join('');

  return `
    ${generateHeaderHtml()}
    <main id="main-content" class="min-h-screen">
      <section class="py-14 sm:py-20 px-4 max-w-7xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          100% Client-Side Processing • Zero Server Uploads
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Free, Private &amp; In-Browser PDF Suite
        </h1>
        <p class="text-base sm:text-xl text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          The Swiss Army Knife for PDFs. 17 professional PDF utilities running entirely inside your browser memory via WebAssembly and Web Workers. No file uploads. No cookies. No ads. No tracking.
        </p>
        <div class="flex flex-wrap justify-center gap-3 text-xs font-bold text-gray-500 dark:text-zinc-400">
          <span class="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-xl">Merge &amp; Split</span>
          <span class="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-xl">Compress &amp; Repair</span>
          <span class="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-xl">Protect &amp; Unlock</span>
          <span class="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-xl">OCR &amp; Convert</span>
          <span class="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-xl">Watermark &amp; Sign</span>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 mb-20" aria-label="Available PDF Tools">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">All 17 PDF Tools</h2>
            <p class="text-xs text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-bold mt-1">Select any tool to process your document immediately</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${toolsHtml}
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 mb-20" aria-label="Privacy &amp; Architecture">
        <div class="p-8 sm:p-12 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-gray-100 dark:border-white/5">
          <div class="max-w-3xl">
            <h2 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              Zero Server Uploads. True In-Browser PDF Security.
            </h2>
            <p class="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">
              Traditional cloud PDF services require you to transmit sensitive financial statements, legal contracts, identity documents, and medical reports to remote cloud servers for manipulation. This creates unacceptable data breach and compliance risks.
            </p>
            <p class="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed mb-6">
              LS PDF operates on a strict zero-server paradigm: every operation—merging, rasterizing, rendering, extracting, OCR, and cryptographic encryption—executes directly on your local CPU and GPU via Mozilla PDF.js, pdf-lib, and Web Workers. Your files never cross the network.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Local Processing</h3>
                <p class="text-xs text-gray-500 dark:text-zinc-400">100% in-browser WebAssembly and Web Worker pipelines.</p>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Zero Telemetry</h3>
                <p class="text-xs text-gray-500 dark:text-zinc-400">No document content, file names, or metadata are ever recorded.</p>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Auto-Wipe Memory</h3>
                <p class="text-xs text-gray-500 dark:text-zinc-400">Configurable inactivity timer clears cached buffers automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${generateFooterHtml()}
  `;
}

function generateToolBodyHtml(guide: ToolGuideData): string {
  const whatItDoesHtml = guide.whatItDoes
    .map((p) => `<p class="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed mb-3">${p}</p>`)
    .join('');

  const howToHtml = guide.howTo
    .map((step) => `<li class="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed pl-2">${step}</li>`)
    .join('');

  const specsHtml = guide.specs
    .map(
      (spec) => `
      <div class="p-4 bg-gray-50 dark:bg-zinc-900/60 rounded-xl border border-gray-100 dark:border-white/5">
        <dt class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1">${spec.label}</dt>
        <dd class="text-sm font-bold text-gray-900 dark:text-zinc-200">${spec.value}</dd>
      </div>
    `
    )
    .join('');

  const faqsHtml = guide.faqs
    .map(
      (faq) => `
      <div class="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2">${faq.q}</h3>
        <p class="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">${faq.a}</p>
      </div>
    `
    )
    .join('');

  const relatedHtml = guide.related
    .map(
      (rel) => `
      <article class="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all">
        <a href="/${rel.slug}" class="block group">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors mb-1">${rel.title}</h3>
          <p class="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">${rel.desc}</p>
        </a>
      </article>
    `
    )
    .join('');

  return `
    ${generateHeaderHtml()}
    <main id="main-content" class="min-h-screen py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      <nav aria-label="Breadcrumb Navigation" class="text-xs font-bold text-gray-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
        <a href="/" class="hover:text-rose-500 transition-colors">Home</a>
        <span>&gt;</span>
        <span class="text-gray-900 dark:text-zinc-300">${guide.title}</span>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          ${guide.h1}
        </h1>
        <p class="text-base sm:text-lg text-gray-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          ${guide.summary}
        </p>
      </header>

      <section class="p-8 sm:p-12 mb-14 rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 text-center" aria-label="File Upload Region">
        <div class="max-w-md mx-auto">
          <div class="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xl">PDF</div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Drop your PDF file here or select to begin</h2>
          <p class="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mb-4">
            Files are processed strictly inside your device memory using WebAssembly. No files are ever uploaded to any server.
          </p>
          <div class="inline-block px-5 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-500/20">
            Select PDF Document
          </div>
        </div>
      </section>

      <article class="space-y-12">
        <section aria-labelledby="overview-heading">
          <h2 id="overview-heading" class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            About ${guide.title}
          </h2>
          <div class="prose dark:prose-invert max-w-none">
            ${whatItDoesHtml}
          </div>
        </section>

        <section aria-labelledby="howto-heading">
          <h2 id="howto-heading" class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            How to Use ${guide.title}
          </h2>
          <ol class="list-decimal list-inside space-y-2.5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
            ${howToHtml}
          </ol>
        </section>

        <section aria-labelledby="specs-heading">
          <h2 id="specs-heading" class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Technical Specifications &amp; Security Disclosures
          </h2>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${specsHtml}
          </dl>
        </section>

        <section aria-labelledby="faqs-heading">
          <h2 id="faqs-heading" class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
            Frequently Asked Questions
          </h2>
          <div class="space-y-3">
            ${faqsHtml}
          </div>
        </section>

        <section aria-labelledby="related-heading">
          <h2 id="related-heading" class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            Related PDF Tools
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${relatedHtml}
          </div>
        </section>
      </article>
    </main>
    ${generateFooterHtml()}
  `;
}

function generateAboutBodyHtml(): string {
  return `
    ${generateHeaderHtml()}
    <main id="main-content" class="min-h-screen py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      <nav aria-label="Breadcrumb Navigation" class="text-xs font-bold text-gray-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
        <a href="/" class="hover:text-rose-500 transition-colors">Home</a>
        <span>&gt;</span>
        <span class="text-gray-900 dark:text-zinc-300">About</span>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          About LS PDF
        </h1>
        <p class="text-base sm:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed">
          The Swiss Army Knife for PDFs. Fully client-side, privacy-preserving, and free under AGPL-3.0.
        </p>
      </header>

      <article class="space-y-8 text-gray-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
        <section>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Our Mission: Private Document Processing</h2>
          <p class="mb-3">
            LS PDF was engineered to eliminate the fundamental privacy danger of modern online PDF software: uploading proprietary files to distant cloud backends. By using the computational power of modern browser standards—WebAssembly, Canvas 2D, and Web Workers—all operations execute entirely within your device.
          </p>
          <p>
            Whether merging confidential business proposals, compressing tax filings, or redacting document metadata, your files never touch an external server.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Technology Stack</h2>
          <ul class="list-disc list-inside space-y-1.5 text-gray-600 dark:text-zinc-400">
            <li><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS, Vite 8</li>
            <li><strong>PDF Core:</strong> Mozilla PDF.js (rendering &amp; text extraction), pdf-lib (assembly &amp; manipulation)</li>
            <li><strong>Security:</strong> @pdfsmaller/pdf-encrypt-lite (RC4 &amp; AES-128 password encryption)</li>
            <li><strong>OCR Engine:</strong> Tesseract.js (pure browser-side WebAssembly optical character recognition)</li>
            <li><strong>Cross-Platform:</strong> Capacitor 8 (native Android execution bridge)</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Open Source &amp; Licensing</h2>
          <p>
            LS PDF is free and open-source software distributed under the GNU Affero General Public License v3.0 (AGPL-3.0). The full source code is publicly auditable on GitHub at <a href="https://github.com/girishlade111/LS-PDF" target="_blank" rel="noopener noreferrer" class="text-rose-500 font-bold hover:underline">girishlade111/LS-PDF</a>.
          </p>
        </section>
      </article>
    </main>
    ${generateFooterHtml()}
  `;
}

function generatePrivacyBodyHtml(): string {
  return `
    ${generateHeaderHtml()}
    <main id="main-content" class="min-h-screen py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      <nav aria-label="Breadcrumb Navigation" class="text-xs font-bold text-gray-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
        <a href="/" class="hover:text-rose-500 transition-colors">Home</a>
        <span>&gt;</span>
        <span class="text-gray-900 dark:text-zinc-300">Privacy Policy</span>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          Privacy Policy &amp; Security Specification
        </h1>
        <p class="text-base sm:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed">
          How LS PDF protects your data sovereignty: zero server uploads, no cookies, and transparent device storage.
        </p>
      </header>

      <article class="space-y-8 text-gray-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
        <section>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">1. Zero Document Transmission</h2>
          <p>
            LS PDF is architected on a zero-server principle. When you open a PDF, your file is read directly into your device's memory using browser File API and Blob structures. At no point are document bytes, file names, or file contents transmitted over the Internet.
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">2. Local Storage and IndexedDB</h2>
          <p class="mb-3">
            To provide persistent convenience features across sessions, LS PDF utilizes your browser's local sandbox storage:
          </p>
          <ul class="list-disc list-inside space-y-1.5 text-gray-600 dark:text-zinc-400">
            <li><strong>Activity History (IndexedDB):</strong> Stores recent download shortcuts on-device. Can be cleared at any time in Settings.</li>
            <li><strong>Workspace Snapshots (IndexedDB):</strong> Temporarily holds in-progress multi-page edits to survive accidental refreshes. Cleared upon tool completion or via Auto-Wipe.</li>
            <li><strong>Preferences (localStorage):</strong> Retains your dark/light theme and auto-wipe timer configuration.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">3. Cookieless Anonymous Analytics</h2>
          <p>
            LS PDF does not set any cookies and does not utilize invasive tracking pixels or fingerprinting scripts. Aggregate page load times and coarse traffic volumes are monitored using cookieless Vercel Web Analytics. This telemetry records only anonymized technical performance data and never collects document names, file contents, IP addresses, or personal identities.
          </p>
        </section>
      </article>
    </main>
    ${generateFooterHtml()}
  `;
}

function generateSettingsBodyHtml(): string {
  return `
    ${generateHeaderHtml()}
    <main id="main-content" class="min-h-screen py-10 px-4 sm:px-6 max-w-4xl mx-auto">
      <nav aria-label="Breadcrumb Navigation" class="text-xs font-bold text-gray-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
        <a href="/" class="hover:text-rose-500 transition-colors">Home</a>
        <span>&gt;</span>
        <span class="text-gray-900 dark:text-zinc-300">Settings</span>
      </nav>

      <header class="mb-10">
        <h1 class="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          Application Settings
        </h1>
        <p class="text-base sm:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed">
          Manage local preferences, theme customization, workspace retention, and Auto-Wipe security timers.
        </p>
      </header>

      <div class="space-y-6">
        <div class="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Theme Preference</h2>
          <p class="text-xs text-gray-500 dark:text-zinc-400 mb-4">Choose between Light, Dark, or System automatic appearance.</p>
        </div>

        <div class="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Auto-Wipe Security Timer</h2>
          <p class="text-xs text-gray-500 dark:text-zinc-400 mb-4">Automatically purges cached IndexedDB documents and activity history after a period of user inactivity.</p>
        </div>

        <div class="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Storage Management</h2>
          <p class="text-xs text-gray-500 dark:text-zinc-400 mb-4">Clear all local workspace caches and reset all stored preferences.</p>
        </div>
      </div>
    </main>
    ${generateFooterHtml()}
  `;
}

function generateNotFoundBodyHtml(): string {
  return `
    ${generateHeaderHtml()}
    <main id="main-content" class="min-h-screen py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      <div class="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 font-black text-2xl">404</div>
      <h1 class="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
        404 - Page Not Found
      </h1>
      <p class="text-base text-gray-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed mb-8">
        The PDF tool or page you requested does not exist or may have been moved. Return to the homepage or explore our popular tools below.
      </p>
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <a href="/" class="px-6 py-3 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors">
          Return to Homepage
        </a>
      </div>
      <div class="border-t border-gray-100 dark:border-white/5 pt-10">
        <h2 class="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-6">Popular PDF Utilities</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <a href="/merge" class="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Merge PDF</h3>
            <p class="text-[11px] text-gray-400">Combine multiple documents</p>
          </a>
          <a href="/split" class="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Split PDF</h3>
            <p class="text-[11px] text-gray-400">Extract page ranges</p>
          </a>
          <a href="/compress" class="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">Compress PDF</h3>
            <p class="text-[11px] text-gray-400">Optimize document size</p>
          </a>
          <a href="/pdf-to-text" class="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">PDF to Text</h3>
            <p class="text-[11px] text-gray-400">OCR &amp; native text extract</p>
          </a>
        </div>
      </div>
    </main>
    ${generateFooterHtml()}
  `;
}

function injectSEO(html: string, seo: ToolSEOData, bodyContent: string): string {
  let result = html;

  // Replace Title
  result = result.replace(/<title>[^<]*<\/title>/g, `<title>${seo.title}</title>`);

  // Replace Meta Description
  result = result.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/g,
    `<meta name="description" content="${seo.description}" />`
  );

  // Replace Meta Keywords
  if (seo.keywords) {
    result = result.replace(
      /<meta name="keywords" content="[^"]*"\s*\/?>/g,
      `<meta name="keywords" content="${seo.keywords}" />`
    );
  }

  // Replace Canonical Link (with data-rh="true" for react-helmet-async hydration)
  result = result.replace(
    /<link rel="canonical"[^>]*\s*\/?>/g,
    `<link rel="canonical" href="${seo.canonical}" data-rh="true" />`
  );

  // Replace Open Graph Url
  result = result.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/g,
    `<meta property="og:url" content="${seo.canonical}" />`
  );

  // Replace Open Graph Title
  result = result.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/g,
    `<meta property="og:title" content="${seo.ogTitle || seo.title}" />`
  );

  // Replace Open Graph Description
  result = result.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/g,
    `<meta property="og:description" content="${seo.ogDescription || seo.description}" />`
  );

  // Replace Twitter Url
  result = result.replace(
    /<meta name="twitter:url" content="[^"]*"\s*\/?>/g,
    `<meta name="twitter:url" content="${seo.canonical}" />`
  );

  // Replace Twitter Title
  result = result.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/g,
    `<meta name="twitter:title" content="${seo.ogTitle || seo.title}" />`
  );

  // Replace Twitter Description
  result = result.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/g,
    `<meta name="twitter:description" content="${seo.ogDescription || seo.description}" />`
  );

  // Replace robots if custom
  if (seo.robots) {
    result = result.replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/g,
      `<meta name="robots" content="${seo.robots}" />`
    );
  }

  // Replace JSON-LD: Organization Schema with page-specific schemas + Breadcrumb
  const schemas = Array.isArray(seo.jsonLd) ? seo.jsonLd : [seo.jsonLd];
  const breadcrumb = generateBreadcrumbJsonLd(seo.canonical);
  const allJsonLd = [...schemas, breadcrumb];

  const jsonLdScripts = allJsonLd
    .map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n    ');

  result = result.replace(
    /<!-- JSON-LD: Organization Schema -->\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
    `<!-- JSON-LD Structured Data -->\n    ${jsonLdScripts}`
  );

  // Inject rendered body HTML into <div id="root">
  result = result.replace(
    /<div id="root"><\/div>/g,
    `<div id="root">${bodyContent}</div>`
  );

  return result;
}

// 1. Optimize the home page directly in dist/index.html
const homeBody = generateHomeBodyHtml();
const homeHtml = injectSEO(template, homeSEO, homeBody);
fs.writeFileSync(TEMPLATE_PATH, homeHtml);
console.log('Successfully prerendered and optimized: / (home page)');

// 2. Generate sub-routes
for (const route of routes) {
  const routeDir = path.join(DIST_DIR, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  let bodyContent = '';
  if (route.slug && TOOL_GUIDES[route.slug]) {
    bodyContent = generateToolBodyHtml(TOOL_GUIDES[route.slug]);
  } else if (route.path === 'about') {
    bodyContent = generateAboutBodyHtml();
  } else if (route.path === 'privacy') {
    bodyContent = generatePrivacyBodyHtml();
  } else if (route.path === 'settings') {
    bodyContent = generateSettingsBodyHtml();
  }

  const routeHtml = injectSEO(template, route.seo, bodyContent);
  // Write both index.html inside folder and route.html for universal server matching
  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml);
  fs.writeFileSync(path.join(DIST_DIR, `${route.path}.html`), routeHtml);
  console.log(`Successfully prerendered and optimized: /${route.path}`);
}

// 3. Generate Mobile Routes (android-tools and android-history) so static direct access works
const mobileRoutes = [
  { path: 'android-tools', title: 'Android Tools | LS PDF' },
  { path: 'android-history', title: 'Activity History | LS PDF' }
];

for (const mRoute of mobileRoutes) {
  const mDir = path.join(DIST_DIR, mRoute.path);
  if (!fs.existsSync(mDir)) {
    fs.mkdirSync(mDir, { recursive: true });
  }
  const mSeo: ToolSEOData = {
    title: `${mRoute.title}`,
    description: 'LS PDF mobile interface.',
    keywords: 'ls pdf android',
    canonical: `https://pdf.ladestack.in/${mRoute.path}`,
    robots: 'noindex, nofollow',
    jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: mRoute.title }
  };
  const mHtml = injectSEO(template, mSeo, `<div class="p-8 text-center"><h1 class="text-2xl font-bold">${mRoute.title}</h1></div>`);
  fs.writeFileSync(path.join(mDir, 'index.html'), mHtml);
  fs.writeFileSync(path.join(DIST_DIR, `${mRoute.path}.html`), mHtml);
  console.log(`Successfully prerendered mobile route: /${mRoute.path}`);
}

// 4. Generate 404.html for true HTTP 404 responses
const notFoundSeo: ToolSEOData = {
  title: '404 - Page Not Found | LS PDF',
  description: 'The requested page could not be found.',
  keywords: '404, not found',
  canonical: 'https://pdf.ladestack.in/404',
  robots: 'noindex, nofollow',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '404 Page Not Found',
    url: 'https://pdf.ladestack.in/404'
  }
};
const notFoundBody = generateNotFoundBodyHtml();
const notFoundHtml = injectSEO(template, notFoundSeo, notFoundBody);
fs.writeFileSync(path.join(DIST_DIR, '404.html'), notFoundHtml);
console.log('Successfully prerendered 404 error page: dist/404.html');

console.log('All 21 canonical routes + mobile routes + 404.html prerendered successfully.');
