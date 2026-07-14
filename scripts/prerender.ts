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

// Resolve __dirname in ESM
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
  seo: ToolSEOData;
}

const routes: RouteConfig[] = [
  { path: 'merge', seo: mergeSEO },
  { path: 'split', seo: splitSEO },
  { path: 'compress', seo: compressSEO },
  { path: 'protect', seo: protectSEO },
  { path: 'unlock', seo: unlockSEO },
  { path: 'rotate-pdf', seo: rotateSEO },
  { path: 'rearrange-pdf', seo: rearrangeSEO },
  { path: 'page-numbers', seo: pageNumbersSEO },
  { path: 'watermark', seo: watermarkSEO },
  { path: 'metadata', seo: metadataSEO },
  { path: 'signature', seo: signatureSEO },
  { path: 'grayscale', seo: grayscaleSEO },
  { path: 'pdf-to-image', seo: pdfToImageSEO },
  { path: 'image-to-pdf', seo: imageToPdfSEO },
  { path: 'extract-images', seo: extractImagesSEO },
  { path: 'pdf-to-text', seo: pdfToTextSEO },
  { path: 'repair', seo: repairSEO },
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

function injectSEO(html: string, seo: ToolSEOData): string {
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

  // Replace Canonical Link
  result = result.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/g,
    `<link rel="canonical" href="${seo.canonical}" />`
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

  return result;
}

// 1. Optimize the home page directly in dist/index.html
const homeHtml = injectSEO(template, homeSEO);
fs.writeFileSync(TEMPLATE_PATH, homeHtml);
console.log('Successfully prerendered and optimized: / (home page)');

// 2. Generate sub-routes
for (const route of routes) {
  const routeDir = path.join(DIST_DIR, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const routeHtml = injectSEO(template, route.seo);
  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml);
  console.log(`Successfully prerendered and optimized: /${route.path}`);
}

console.log('SEO Prerendering completed successfully.');
