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

const rawTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Ensure template is pristine even if prerender runs repeatedly without a preceding vite build
let cleanTemplate = rawTemplate.replace(
  /<div id="root">[\s\S]*?<\/div>\s*(<script type="module")/i,
  '<div id="root"></div>\n    $1'
);

// Reset previously injected JSON-LD to a clean placeholder
cleanTemplate = cleanTemplate.replace(
  /<!-- JSON-LD Structured Data -->[\s\S]*?(?=<script type="module"|<\/head>)/i,
  '<!-- JSON-LD: Organization Schema -->\n    <script type="application/ld+json">{}</script>\n'
);

const template = cleanTemplate;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface RouteConfig {
  path: string;
  slug?: string;
  desc?: string;
  seo: ToolSEOData;
}

const routes: RouteConfig[] = [
  { path: 'merge', slug: 'merge', desc: 'Combine multiple PDF files into one document. Processed entirely on your device.', seo: mergeSEO },
  { path: 'split', slug: 'split', desc: 'Visually extract specific pages or ranges. Processed entirely on your device.', seo: splitSEO },
  { path: 'compress', slug: 'compress', desc: 'Optimize your file size for easier sharing. Processed entirely on your device.', seo: compressSEO },
  { path: 'protect', slug: 'protect', desc: 'Secure your documents with strong password encryption. Processed entirely on your device.', seo: protectSEO },
  { path: 'unlock', slug: 'unlock', desc: 'Remove password protection from your PDF files. Processed entirely on your device.', seo: unlockSEO },
  { path: 'rotate-pdf', slug: 'rotate-pdf', desc: 'Fix page orientation permanently. Processed entirely on your device.', seo: rotateSEO },
  { path: 'rearrange-pdf', slug: 'rearrange-pdf', desc: 'Drag and drop pages to reorder them. Processed entirely on your device.', seo: rearrangeSEO },
  { path: 'page-numbers', slug: 'page-numbers', desc: 'Add numbering to your documents automatically. Processed entirely on your device.', seo: pageNumbersSEO },
  { path: 'watermark', slug: 'watermark', desc: 'Overlay custom text for branding or security. Processed entirely on your device.', seo: watermarkSEO },
  { path: 'metadata', slug: 'metadata', desc: 'Edit document properties for better privacy. Processed entirely on your device.', seo: metadataSEO },
  { path: 'signature', slug: 'signature', desc: 'Add your electronic signature to any document. Processed entirely on your device.', seo: signatureSEO },
  { path: 'grayscale', slug: 'grayscale', desc: 'Convert all document pages to black and white. Processed entirely on your device.', seo: grayscaleSEO },
  { path: 'pdf-to-image', slug: 'pdf-to-image', desc: 'Convert document pages into high-quality images. Processed entirely on your device.', seo: pdfToImageSEO },
  { path: 'image-to-pdf', slug: 'image-to-pdf', desc: 'Convert JPG, PNG, and WebP into a professional PDF. Processed entirely on your device.', seo: imageToPdfSEO },
  { path: 'extract-images', slug: 'extract-images', desc: 'Pull out all original images embedded in a PDF. Processed entirely on your device.', seo: extractImagesSEO },
  { path: 'pdf-to-text', slug: 'pdf-to-text', desc: 'Extract plain text from your PDF documents. Processed entirely on your device.', seo: pdfToTextSEO },
  { path: 'repair', slug: 'repair', desc: 'Attempt to fix corrupted or unreadable documents. Processed entirely on your device.', seo: repairSEO },
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
    <header class="flex items-center justify-between px-4 md:px-8 h-16 md:h-20 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-[100]">
      <div class="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
        <a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
            <rect width="100" height="100" rx="28" fill="#F43F5E" />
            <path d="M28 32H72V42H28V32Z" fill="white" />
            <path d="M28 48H72V58H28V48Z" fill="white" />
            <path d="M28 64H52V74H28V64Z" fill="white" />
          </svg>
          <span class="font-black tracking-tighter text-lg md:text-xl dark:text-white hidden xs:block">LS PDF</span>
        </a>
        <div class="h-6 w-[1px] bg-gray-200 dark:bg-zinc-800 mx-1 md:mx-2 shrink-0"></div>
        <div class="relative min-w-0">
          <a href="/" class="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-xl transition-all font-black text-[10px] md:text-sm uppercase tracking-widest min-w-0 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900" aria-label="All Tools Directory">
            <span class="truncate">All Tools</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m6 9 6 6 6-6"/></svg>
          </a>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a href="https://github.com/girishlade111/LS-PDF" target="_blank" rel="noreferrer" class="p-2 md:p-2.5 rounded-xl text-gray-500 hover:text-rose-500 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors" aria-label="GitHub Repository">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </a>
      </div>
    </header>
  `;
}

function generateFooterHtml(): string {
  return `
    <footer class="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 pt-16 pb-12 mt-auto">
      <div class="max-w-7xl mx-auto px-6 md:px-8">
        <div class="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 pb-16">
          <div class="col-span-2 md:col-span-4 space-y-4">
            <a href="/" class="flex items-center gap-2.5 text-gray-900 dark:text-white group w-fit">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
                <rect width="100" height="100" rx="28" fill="#F43F5E" />
                <path d="M28 32H72V42H28V32Z" fill="white" />
                <path d="M28 48H72V58H28V48Z" fill="white" />
                <path d="M28 64H52V74H28V64Z" fill="white" />
              </svg>
              <span class="font-black tracking-tight text-xl group-hover:text-rose-500 transition-colors">LS PDF</span>
            </a>
            <p class="text-gray-500 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
              The privacy-first PDF toolkit. 17 client-side tools running 100% on your device with zero server uploads. Open source, cookieless, and free forever.
            </p>
            <div class="flex items-center gap-2 pt-2">
              <div class="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-wide border border-emerald-100 dark:border-emerald-900/20">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Client Engine Active
              </div>
            </div>
          </div>
          <div class="col-span-1 md:col-span-2 space-y-3">
            <h4 class="font-black text-[10px] uppercase tracking-widest text-rose-500">Edit</h4>
            <ul class="space-y-2 text-xs list-none p-0">
              <li><a href="/merge" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Merge PDF</a></li>
              <li><a href="/split" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Split PDF</a></li>
              <li><a href="/rotate-pdf" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Rotate PDF</a></li>
              <li><a href="/rearrange-pdf" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Rearrange PDF</a></li>
              <li><a href="/page-numbers" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Page Numbers</a></li>
              <li><a href="/watermark" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Watermark</a></li>
              <li><a href="/signature" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Signature</a></li>
            </ul>
          </div>
          <div class="col-span-1 md:col-span-2 space-y-3">
            <h4 class="font-black text-[10px] uppercase tracking-widest text-emerald-500">Convert</h4>
            <ul class="space-y-2 text-xs list-none p-0">
              <li><a href="/pdf-to-image" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">PDF to Image</a></li>
              <li><a href="/image-to-pdf" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Image to PDF</a></li>
              <li><a href="/extract-images" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Extract Images</a></li>
              <li><a href="/pdf-to-text" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">PDF to Text</a></li>
            </ul>
          </div>
          <div class="col-span-1 md:col-span-2 space-y-3">
            <h4 class="font-black text-[10px] uppercase tracking-widest text-indigo-500">Security &amp; Optimize</h4>
            <ul class="space-y-2 text-xs list-none p-0">
              <li><a href="/protect" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Protect PDF</a></li>
              <li><a href="/unlock" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Unlock PDF</a></li>
              <li><a href="/metadata" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Edit Metadata</a></li>
              <li><a href="/compress" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Compress PDF</a></li>
              <li><a href="/grayscale" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Grayscale</a></li>
              <li><a href="/repair" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Repair PDF</a></li>
            </ul>
          </div>
          <div class="col-span-1 md:col-span-2 space-y-3">
            <h4 class="font-black text-[10px] uppercase tracking-widest text-gray-900 dark:text-white">Protocol</h4>
            <ul class="space-y-2 text-xs list-none p-0">
              <li><a href="/about" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">About LS PDF</a></li>
              <li><a href="/privacy" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Privacy Spec</a></li>
              <li><a href="/settings" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Settings</a></li>
              <li><a href="https://github.com/girishlade111/LS-PDF/blob/main/LICENSE" target="_blank" rel="noreferrer" class="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">License (AGPL-3.0)</a></li>
            </ul>
          </div>
        </div>
        <div class="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-zinc-500 font-medium">
          <p>&copy; 2026 LS PDF Project. Cookieless &amp; 100% on-device document processing.</p>
          <p class="text-[11px] text-gray-400">Crafted by Girish Lade &mdash; LadeStack</p>
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
      <a href="/${tool.slug}" class="group relative flex flex-col p-6 rounded-[2rem] bg-white dark:bg-zinc-900/40 border border-gray-100 dark:border-white/5 hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all duration-300 text-left hover:shadow-2xl hover:shadow-rose-500/5 hover:-translate-y-1 block">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-rose-50 dark:bg-rose-900/20 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <h2 class="font-black text-gray-900 dark:text-white mb-2 text-lg tracking-tight group-hover:text-rose-500 transition-colors">${escapeHtml(tool.title)}</h2>
        <p class="text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed line-clamp-2">${escapeHtml(tool.summary)}</p>
        <div class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-rose-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </a>
    `
    )
    .join('');

  return `
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      ${generateHeaderHtml()}
      <div class="min-h-screen bg-[#FAFAFA] dark:bg-black transition-colors duration-500">
        <section class="relative pt-20 pb-16 px-6 overflow-hidden">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05),transparent_70%)] pointer-events-none"></div>
          <div class="max-w-6xl mx-auto text-center relative z-10">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-rose-100 dark:border-rose-900/30">
              Professional PDF Engine
            </div>
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter dark:text-white mb-8 leading-[0.9]">
              Stop Uploading <br/>
              <span class="text-rose-500">Your Privacy.</span>
            </h1>
            <p class="max-w-2xl mx-auto text-base md:text-lg text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
              A complete, private PDF toolkit with 17 tools. Merge, split, compress, protect, convert, and edit documents entirely in your browser. Zero file uploads, zero servers, and absolute data sovereignty.
            </p>
            <div class="max-w-2xl mx-auto relative group mt-12">
              <input 
                type="text"
                placeholder="Search tools (e.g. merge, compress, protect...)"
                class="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 rounded-[2rem] py-6 pl-8 pr-8 shadow-2xl shadow-gray-200/50 dark:shadow-none outline-none font-bold text-xl dark:text-white"
              />
            </div>
          </div>
        </section>

        <main class="max-w-7xl mx-auto px-6 pb-32">
          <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-12">
                <div class="flex flex-wrap gap-2">
                  <span class="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg">All</span>
                  <a href="/merge" class="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-white/5 hover:border-rose-500">Edit</a>
                  <a href="/protect" class="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-white/5 hover:border-rose-500">Secure</a>
                  <a href="/pdf-to-image" class="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-white/5 hover:border-rose-500">Convert</a>
                  <a href="/compress" class="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-white/5 hover:border-rose-500">Optimize</a>
                </div>
                <p class="hidden md:block text-[10px] font-black text-gray-400 uppercase tracking-widest">17 Modules Active</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${toolsHtml}
              </div>

              <section class="mt-24 pt-16 border-t border-gray-100 dark:border-white/5 space-y-16 text-left" aria-label="Architecture and Features">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div class="p-8 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-4">
                    <h2 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">Zero-Server Privacy</h2>
                    <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-normal">
                      Every operation runs 100% inside your browser memory using WebAssembly, Web Workers, and local canvas pipelines. Your confidential contracts, financial records, and medical files never touch a remote server.
                    </p>
                  </div>
                  <div class="p-8 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-4">
                    <h2 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">High-Performance Engine</h2>
                    <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-normal">
                      Powered by Mozilla PDF.js, pdf-lib, and Tesseract.js. Handle multi-megabyte documents, high-DPI rasterization, optical character recognition, and drag-and-drop page manipulation at native speed.
                    </p>
                  </div>
                  <div class="p-8 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-4">
                    <h2 class="text-xl font-black text-gray-900 dark:text-white tracking-tight">17 Specialized Tools</h2>
                    <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-normal">
                      From page numbering and watermarking to AES password encryption, metadata sanitization, and image conversion. Everything you need for daily document processing without subscriptions or ads.
                    </p>
                  </div>
                </div>

                <div class="space-y-6">
                  <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Explore the PDF Tool Suite</h2>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="space-y-3">
                      <h3 class="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Edit</h3>
                      <ul class="space-y-2 list-none p-0 text-sm font-bold text-gray-700 dark:text-zinc-300">
                        <li><a href="/merge" class="hover:text-rose-500 transition-colors">Merge PDF</a></li>
                        <li><a href="/split" class="hover:text-rose-500 transition-colors">Split PDF</a></li>
                        <li><a href="/rotate-pdf" class="hover:text-rose-500 transition-colors">Rotate PDF</a></li>
                        <li><a href="/rearrange-pdf" class="hover:text-rose-500 transition-colors">Rearrange PDF</a></li>
                        <li><a href="/page-numbers" class="hover:text-rose-500 transition-colors">Page Numbers</a></li>
                        <li><a href="/watermark" class="hover:text-rose-500 transition-colors">Watermark</a></li>
                        <li><a href="/signature" class="hover:text-rose-500 transition-colors">Signature</a></li>
                      </ul>
                    </div>
                    <div class="space-y-3">
                      <h3 class="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Secure</h3>
                      <ul class="space-y-2 list-none p-0 text-sm font-bold text-gray-700 dark:text-zinc-300">
                        <li><a href="/protect" class="hover:text-rose-500 transition-colors">Protect PDF</a></li>
                        <li><a href="/unlock" class="hover:text-rose-500 transition-colors">Unlock PDF</a></li>
                        <li><a href="/metadata" class="hover:text-rose-500 transition-colors">Metadata</a></li>
                      </ul>
                    </div>
                    <div class="space-y-3">
                      <h3 class="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Convert</h3>
                      <ul class="space-y-2 list-none p-0 text-sm font-bold text-gray-700 dark:text-zinc-300">
                        <li><a href="/pdf-to-image" class="hover:text-rose-500 transition-colors">PDF to Image</a></li>
                        <li><a href="/image-to-pdf" class="hover:text-rose-500 transition-colors">Image to PDF</a></li>
                        <li><a href="/extract-images" class="hover:text-rose-500 transition-colors">Extract Images</a></li>
                        <li><a href="/pdf-to-text" class="hover:text-rose-500 transition-colors">PDF to Text</a></li>
                      </ul>
                    </div>
                    <div class="space-y-3">
                      <h3 class="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Optimize</h3>
                      <ul class="space-y-2 list-none p-0 text-sm font-bold text-gray-700 dark:text-zinc-300">
                        <li><a href="/compress" class="hover:text-rose-500 transition-colors">Compress PDF</a></li>
                        <li><a href="/grayscale" class="hover:text-rose-500 transition-colors">Grayscale</a></li>
                        <li><a href="/repair" class="hover:text-rose-500 transition-colors">Repair PDF</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      ${generateFooterHtml()}
    </div>
  `;
}

function generateToolBodyHtml(guide: ToolGuideData, desc: string): string {
  const whatItDoesHtml = guide.whatItDoes
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');

  const howToHtml = guide.howTo
    .map((step, idx) => `
      <li class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100/80 dark:border-white/5">
        <span class="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
        <span class="text-xs md:text-sm text-gray-700 dark:text-zinc-300 font-medium leading-relaxed">${escapeHtml(step)}</span>
      </li>
    `)
    .join('');

  const specsHtml = guide.specs
    .map(
      (spec) => `
      <div class="p-4 bg-white dark:bg-zinc-900/60 rounded-2xl border border-gray-100 dark:border-white/5">
        <dt class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1">${escapeHtml(spec.label)}</dt>
        <dd class="text-xs md:text-sm font-bold text-gray-900 dark:text-white">${escapeHtml(spec.value)}</dd>
      </div>
    `
    )
    .join('');

  const faqsHtml = guide.faqs
    .map(
      (faq) => `
      <details class="group p-5 bg-white dark:bg-zinc-900/40 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all open:ring-1 open:ring-rose-500/20">
        <summary class="flex items-center justify-between cursor-pointer list-none font-bold text-sm md:text-base text-gray-900 dark:text-white select-none">
          <span>${escapeHtml(faq.q)}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2"><path d="m6 9 6 6 6-6"/></svg>
        </summary>
        <p class="mt-3 text-xs md:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-normal pt-2 border-t border-gray-50 dark:border-white/5">
          ${escapeHtml(faq.a)}
        </p>
      </details>
    `
    )
    .join('');

  const relatedHtml = guide.related
    .map(
      (rel) => `
      <a href="/${rel.slug}" class="group p-5 bg-white dark:bg-zinc-900/40 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-rose-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-sm text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors mb-1">${escapeHtml(rel.title)}</h3>
          <p class="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">${escapeHtml(rel.desc)}</p>
        </div>
        <div class="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-500 mt-4 group-hover:translate-x-1 transition-transform">
          <span>Open Tool</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </a>
    `
    )
    .join('');

  return `
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      ${generateHeaderHtml()}
      <div class="flex flex-col min-h-screen bg-[#FAFAFA] dark:bg-black transition-colors">
        <main class="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div class="mb-8">
            <div class="relative text-center mb-8 md:mb-12">
              <h1 class="text-3xl md:text-5xl font-black mb-3 md:mb-4 dark:text-white px-10 text-gray-900 dark:text-white">
                ${escapeHtml(guide.title)} <span class="text-rose-500">.</span>
              </h1>
              <p class="text-sm md:text-base text-gray-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
                ${escapeHtml(desc)}
              </p>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-[2.5rem] bg-white dark:bg-zinc-900/50 text-center mb-12">
              <div class="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <h2 class="text-lg md:text-xl font-bold dark:text-white mb-2">Drop your PDF file here or select to begin</h2>
              <p class="text-xs text-gray-400 max-w-sm mb-6">100% Client-Side. No files ever leave your device.</p>
              <div class="px-6 py-3 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20">
                Select PDF Document
              </div>
            </div>

            <section class="mt-16 pt-12 border-t border-gray-100 dark:border-white/5 space-y-12 text-left" aria-label="${escapeHtml(guide.title)} Guide and Documentation">
              <div class="space-y-4">
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
                  Document Guide
                </div>
                <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">About ${escapeHtml(guide.title)}</h2>
                <div class="space-y-3 text-sm md:text-base text-gray-600 dark:text-zinc-400 leading-relaxed font-normal">
                  ${whatItDoesHtml}
                </div>
              </div>

              <div class="p-6 md:p-8 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                <h2 class="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">How to Use ${escapeHtml(guide.title)}</h2>
                <ol class="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  ${howToHtml}
                </ol>
              </div>

              <div class="space-y-4">
                <h2 class="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Technical Specifications &amp; Security</h2>
                <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  ${specsHtml}
                </dl>
              </div>

              <div class="space-y-4">
                <h2 class="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
                <div class="space-y-3">
                  ${faqsHtml}
                </div>
              </div>

              <div class="space-y-4 pt-4">
                <h2 class="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Related PDF Tools</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  ${relatedHtml}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      ${generateFooterHtml()}
    </div>
  `;
}

function generateAboutBodyHtml(): string {
  return `
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      ${generateHeaderHtml()}
      <div class="min-h-screen bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 selection:bg-rose-500 selection:text-white pb-24">
        <section class="relative pt-20 pb-12 px-6 overflow-hidden">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05),transparent_60%)] pointer-events-none"></div>
          <div class="max-w-5xl mx-auto text-center relative z-10">
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter dark:text-white mb-6 leading-[0.9]">
              Privacy is a <br/>
              <span class="text-rose-500 font-black">Human Right.</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
              LS PDF is an absolute document engine. No servers, no tracking, no compromises. We transform your browser into a self-contained document laboratory.
            </p>
          </div>
        </section>

        <section class="max-w-6xl mx-auto px-6 mb-20">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div class="lg:col-span-5 space-y-8">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 bg-zinc-100 dark:bg-white/5 rounded-md text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-200/50 dark:border-white/5">
                Technical Manifesto
              </div>
              <h2 class="text-3xl font-black tracking-tighter dark:text-white leading-[1.1]">
                Architecture of <br/>
                <span class="text-rose-500">Absolute Sovereignty.</span>
              </h2>
              <p class="text-gray-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                LS PDF rejects the trade-off between convenience and privacy. We've built an engine that runs where the user is, ensuring your sensitive data never crosses a network boundary.
              </p>
              <div class="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                <h4 class="font-black text-[10px] uppercase tracking-widest text-emerald-500 mb-3">Zero Infrastructure</h4>
                <p class="text-xs text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
                  We operate no backend. No databases. No file caches. LS PDF is a static distribution of code that activates your browser's existing power.
                </p>
              </div>
            </div>

            <div class="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
              <div class="border-b border-gray-100 dark:border-zinc-800 pb-6">
                <h3 class="font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white mb-2">How it Works</h3>
                <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Every action is executed locally on your device's CPU. Using high-performance Web Workers and WebAssembly, LS PDF loads your PDF into a sandboxed environment within your browser tab.
                </p>
              </div>
              <div class="border-b border-gray-100 dark:border-zinc-800 pb-6">
                <h3 class="font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white mb-2">Data Lifecycle</h3>
                <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Your documents live exclusively in your browser's volatile memory (RAM). We do not use persistent storage or cookies for your file content. Once the tab is closed, the data is destroyed.
                </p>
              </div>
              <div>
                <h3 class="font-black text-sm uppercase tracking-widest text-gray-900 dark:text-white mb-2">Open Source Verification</h3>
                <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                  Trust requires proof. Our entire codebase is open-source under AGPL-3.0 and available on GitHub for public audit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      ${generateFooterHtml()}
    </div>
  `;
}

function generatePrivacyBodyHtml(): string {
  return `
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      ${generateHeaderHtml()}
      <div class="min-h-screen bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 selection:bg-rose-500 selection:text-white p-6 md:p-12 pb-24">
        <div class="max-w-6xl mx-auto space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div class="md:col-span-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 md:p-16 border border-gray-100 dark:border-white/5 relative overflow-hidden flex flex-col justify-center">
              <div class="relative z-10">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-6 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                  Certified Local Engine
                </div>
                <h1 class="text-5xl md:text-7xl font-black tracking-tighter dark:text-white leading-[0.9] mb-6">
                  Architecture <br/>
                  <span class="text-emerald-500 font-black">of Silence.</span>
                </h1>
                <p class="text-lg text-gray-500 dark:text-zinc-400 font-medium max-w-lg leading-relaxed">
                  LS PDF isn't just "private" by policy; it's private by architecture. We've eliminated the server entirely, ensuring that "No Data Found" is a technical reality, not just a promise.
                </p>
              </div>
            </div>
            <div class="md:col-span-4 bg-zinc-900 text-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/5 shadow-2xl">
              <h2 class="text-2xl font-black tracking-tighter relative z-10 mb-1 leading-none">Zero Server</h2>
              <p class="text-[9px] font-black uppercase tracking-widest text-emerald-500 relative z-10">Absolute Sovereignty</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-8 bg-white dark:bg-zinc-900 rounded-[2.25rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
              <h3 class="font-black text-sm uppercase tracking-widest dark:text-white">On-Device Processing</h3>
              <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                Files are processed locally in your browser memory, with client-side IndexedDB storage used strictly for optional workspace recovery and activity logs. Files never leave your device and are never uploaded to any cloud server.
              </p>
            </div>
            <div class="p-8 bg-white dark:bg-zinc-900 rounded-[2.25rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
              <h3 class="font-black text-sm uppercase tracking-widest dark:text-white">Cookieless Traffic Metrics</h3>
              <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                We collect anonymous, cookieless traffic metrics via Vercel Web Analytics to measure site reliability and performance. No personal identifiers, IP addresses, or tracking cookies are collected. Document contents, text, and filenames never leave your browser.
              </p>
            </div>
            <div class="p-8 bg-white dark:bg-zinc-900 rounded-[2.25rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
              <h3 class="font-black text-sm uppercase tracking-widest dark:text-white">Zero Telemetry</h3>
              <p class="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                No crash reporters, third-party trackers, or session recording SDKs. You can verify network traffic in your browser developer tools during any operation.
              </p>
            </div>
          </div>
        </div>
      </div>
      ${generateFooterHtml()}
    </div>
  `;
}

function generateSettingsBodyHtml(): string {
  return `
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      ${generateHeaderHtml()}
      <div class="flex flex-col min-h-screen bg-[#FAFAFA] dark:bg-black transition-colors">
        <main class="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div class="mb-8">
            <div class="relative text-center mb-8 md:mb-12">
              <h1 class="text-3xl md:text-5xl font-black mb-3 md:mb-4 dark:text-white px-10 text-gray-900 dark:text-white">
                System <span class="text-rose-500">.</span>
              </h1>
              <p class="text-sm md:text-base text-gray-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
                Core Configuration
              </p>
            </div>
          </div>
          <div class="flex-1 space-y-6">
            <div class="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Theme Preference</h2>
              <p class="text-xs text-gray-500 dark:text-zinc-400">Choose between Light, Dark, or System automatic appearance.</p>
            </div>
            <div class="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-white/5">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Auto-Wipe Security Timer</h2>
              <p class="text-xs text-gray-500 dark:text-zinc-400">Automatically purges cached IndexedDB documents and activity history after a period of user inactivity.</p>
            </div>
          </div>
        </main>
      </div>
      ${generateFooterHtml()}
    </div>
  `;
}

function generateNotFoundBodyHtml(): string {
  return `
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      ${generateHeaderHtml()}
      <main class="min-h-screen py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div class="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 font-black text-2xl">404</div>
        <h1 class="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          404 &mdash; Page Not Found <span class="text-rose-500">.</span>
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
    </div>
  `;
}

function injectSEO(html: string, seo: ToolSEOData, bodyContent: string): string {
  let result = html;

  // Replace Title
  result = result.replace(/<title>[^<]*<\/title>/g, `<title>${escapeHtml(seo.title)}</title>`);

  // Replace Meta Description
  result = result.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/g,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`
  );

  // Replace Meta Keywords
  if (seo.keywords) {
    result = result.replace(
      /<meta name="keywords" content="[^"]*"\s*\/?>/g,
      `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`
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
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle || seo.title)}" />`
  );

  // Replace Open Graph Description
  result = result.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/g,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription || seo.description)}" />`
  );

  // Replace Twitter Url
  result = result.replace(
    /<meta name="twitter:url" content="[^"]*"\s*\/?>/g,
    `<meta name="twitter:url" content="${seo.canonical}" />`
  );

  // Replace Twitter Title
  result = result.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/g,
    `<meta name="twitter:title" content="${escapeHtml(seo.ogTitle || seo.title)}" />`
  );

  // Replace Twitter Description
  result = result.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/g,
    `<meta name="twitter:description" content="${escapeHtml(seo.ogDescription || seo.description)}" />`
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

// 2. Generate sub-routes (clean directory structure: dist/<route>/index.html)
for (const route of routes) {
  const routeDir = path.join(DIST_DIR, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  let bodyContent = '';
  if (route.slug && TOOL_GUIDES[route.slug]) {
    bodyContent = generateToolBodyHtml(TOOL_GUIDES[route.slug], route.desc || '');
  } else if (route.path === 'about') {
    bodyContent = generateAboutBodyHtml();
  } else if (route.path === 'privacy') {
    bodyContent = generatePrivacyBodyHtml();
  } else if (route.path === 'settings') {
    bodyContent = generateSettingsBodyHtml();
  }

  const routeHtml = injectSEO(template, route.seo, bodyContent);
  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml);

  // Clean up any legacy flat .html files to avoid file-directory routing ambiguity on Vercel
  const legacyFlatFile = path.join(DIST_DIR, `${route.path}.html`);
  if (fs.existsSync(legacyFlatFile)) {
    fs.unlinkSync(legacyFlatFile);
  }

  console.log(`Successfully prerendered and optimized: /${route.path}`);
}

// 3. Generate Mobile Routes (android-tools and android-history)
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

  const legacyFlatMFile = path.join(DIST_DIR, `${mRoute.path}.html`);
  if (fs.existsSync(legacyFlatMFile)) {
    fs.unlinkSync(legacyFlatMFile);
  }

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

console.log('All 21 canonical routes + mobile routes + 404.html prerendered successfully with zero file duplication.');
