/**
 * LS PDF — Centralized SEO Metadata
 * Per-page titles, descriptions, keywords, and structured data (JSON-LD)
 * for all 20 routes in the application.
 */

export const SITE_URL = 'https://pdf.ladestack.in'
export const SITE_NAME = 'LS PDF'
export const SITE_TAGLINE = 'Free, Private, Client-Side PDF Tools'

// Shared across all tool pages
const COMMON_FEATURES = [
  'No file uploads required',
  '100% client-side processing',
  'Privacy-first — files never leave your device',
  'Free to use — no subscription or account needed',
  'No advertisements',
  'Works offline after first load',
]

export interface ToolSEOData {
  title: string
  description: string
  keywords: string
  canonical: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  robots?: string
  jsonLd: object | object[]
}

const makeWebApp = (
  name: string,
  url: string,
  description: string,
  featureList: string[]
): object => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name,
  url,
  description,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  browserRequirements: 'Requires a modern browser with JavaScript and WebAssembly support',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/OnlineOnly',
  },
  featureList: [...featureList, ...COMMON_FEATURES],
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
})

const makeFAQ = (faqs: { q: string; a: string }[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
})

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
export const homeSEO: ToolSEOData = {
  title: 'LS PDF — Free Online PDF Tools | Merge, Split, Compress & More',
  description:
    'LS PDF is a free, privacy-first PDF toolkit with 17 powerful tools. Merge, split, compress, protect, convert, and edit PDFs entirely in your browser. No file uploads. No ads. No account required.',
  keywords:
    'free pdf tools, merge pdf online, split pdf, compress pdf, protect pdf, unlock pdf, pdf to image, image to pdf, pdf editor, online pdf toolkit, private pdf, no upload pdf',
  canonical: SITE_URL + '/',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'LS PDF',
      url: SITE_URL,
      description:
        'A complete, free, and privacy-first PDF toolkit. 17 tools — merge, split, compress, protect, unlock, rotate, rearrange, watermark, signature, metadata, PDF to image, image to PDF, extract images, PDF to text, grayscale, repair — all running 100% client-side in your browser.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        'Merge PDF',
        'Split PDF',
        'Compress PDF',
        'Protect PDF with Password',
        'Unlock PDF',
        'Rotate PDF',
        'Rearrange PDF Pages',
        'Add Page Numbers',
        'Watermark PDF',
        'Edit PDF Metadata',
        'Add Electronic Signature',
        'Convert PDF to Grayscale',
        'PDF to Image',
        'Image to PDF',
        'Extract Images from PDF',
        'PDF to Text (OCR)',
        'Repair PDF',
        ...COMMON_FEATURES,
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'LS PDF',
      url: SITE_URL,
      description:
        'Free, private, client-side PDF tools. No uploads. No servers.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

// ─── MERGE PDF ───────────────────────────────────────────────────────────────
export const mergeSEO: ToolSEOData = {
  title: 'Merge PDF Online Free — Combine Multiple PDFs into One | LS PDF',
  description:
    'Combine multiple PDF files into a single document in seconds. Drag to reorder pages, merge without quality loss. 100% free, no upload, no account — runs entirely in your browser.',
  keywords:
    'merge pdf online, combine pdf files, join pdf, pdf merger free, merge multiple pdfs, pdf combiner, merge pdf without upload',
  canonical: SITE_URL + '/merge',
  jsonLd: [
    makeWebApp(
      'Merge PDF Online — LS PDF',
      SITE_URL + '/merge',
      'Combine multiple PDF files into a single document. Drag and drop to reorder pages before merging. Runs entirely in your browser with zero file uploads.',
      ['Drag-and-drop reordering', 'Merge unlimited PDF files', 'Preview thumbnails', 'Handles password-protected PDFs']
    ),
    makeFAQ([
      {
        q: 'How do I merge PDF files online for free?',
        a: 'Upload your PDF files to LS PDF Merge tool, drag to reorder if needed, then click Merge. Your combined PDF downloads instantly — no account or payment required.',
      },
      {
        q: 'Are my files uploaded to a server when I merge PDFs?',
        a: 'No. LS PDF processes everything 100% in your browser using WebAssembly. Your files never leave your device and are never sent to any server.',
      },
      {
        q: 'Is there a limit to how many PDFs I can merge?',
        a: 'There is no artificial limit. You can merge as many PDFs as your browser can handle in memory.',
      },
      {
        q: 'Can I merge password-protected PDFs?',
        a: 'Yes. LS PDF will ask you for the password and unlock the file locally in your browser before merging.',
      },
    ]),
  ],
}

// ─── SPLIT PDF ───────────────────────────────────────────────────────────────
export const splitSEO: ToolSEOData = {
  title: 'Split PDF Online Free — Extract Pages from PDF | LS PDF',
  description:
    'Split a PDF into individual pages or custom page ranges. Visually select which pages to extract. Free, no upload, runs entirely in your browser with complete privacy.',
  keywords:
    'split pdf online, extract pdf pages, pdf splitter free, split pdf by page, separate pdf pages, pdf page extractor, split pdf without upload',
  canonical: SITE_URL + '/split',
  jsonLd: [
    makeWebApp(
      'Split PDF Online — LS PDF',
      SITE_URL + '/split',
      'Split a PDF into individual pages or extract specific page ranges. Visual page selector included. 100% client-side — no file uploads.',
      ['Visual page thumbnail selector', 'Extract custom page ranges', 'Download as ZIP or single PDF', 'No file size limit (browser memory only)']
    ),
    makeFAQ([
      {
        q: 'How do I split a PDF online for free?',
        a: 'Upload your PDF, visually select the pages or ranges you want to extract, then click Split. The result downloads immediately — no sign-up needed.',
      },
      {
        q: 'Can I extract just specific pages from a PDF?',
        a: 'Yes. LS PDF lets you select individual pages or define custom ranges (e.g., pages 1–5, 8, 10–12) to extract.',
      },
      {
        q: 'Is it safe to split a confidential PDF using LS PDF?',
        a: 'Yes. All processing happens locally in your browser. Your PDF is never uploaded to any server, making it completely private.',
      },
    ]),
  ],
}

// ─── COMPRESS PDF ─────────────────────────────────────────────────────────────
export const compressSEO: ToolSEOData = {
  title: 'Compress PDF Online Free — Reduce PDF File Size | LS PDF',
  description:
    'Reduce your PDF file size for email, sharing, or storage without quality loss. Choose compression level. 100% free, no upload, processes instantly in your browser.',
  keywords:
    'compress pdf online, reduce pdf file size, pdf compressor free, shrink pdf, optimize pdf for email, pdf size reducer, compress pdf without upload',
  canonical: SITE_URL + '/compress',
  jsonLd: [
    makeWebApp(
      'Compress PDF Online — LS PDF',
      SITE_URL + '/compress',
      'Reduce PDF file size for easier sharing via email or cloud storage. Choose from multiple compression levels. 100% client-side processing.',
      ['Multiple compression levels', 'Lossless and lossy modes', 'Real-time size preview', 'Batch compression support']
    ),
    makeFAQ([
      {
        q: 'How do I compress a PDF to make it smaller?',
        a: 'Upload your PDF to LS PDF Compress, select your desired compression level (low, medium, or high), then download the compressed file. No account needed.',
      },
      {
        q: 'Will compressing a PDF reduce its quality?',
        a: 'LS PDF offers lossless compression that reduces file size with minimal quality impact. Higher compression levels may reduce image quality slightly to achieve smaller sizes.',
      },
      {
        q: 'Why is my PDF too large to email?',
        a: 'PDFs with many images or high-resolution graphics can be large. Use LS PDF Compress to reduce the size to under 10MB for email attachment limits.',
      },
      {
        q: 'Is there a maximum file size for PDF compression?',
        a: 'There is no server-imposed limit. The only limit is your browser\'s available memory, which handles most PDFs without issues.',
      },
    ]),
  ],
}

// ─── PROTECT PDF ─────────────────────────────────────────────────────────────
export const protectSEO: ToolSEOData = {
  title: 'Protect PDF with Password Free — Encrypt PDF Online | LS PDF',
  description:
    'Add a strong password to your PDF to prevent unauthorized access. AES encryption, no file upload required. Free, private, runs 100% in your browser.',
  keywords:
    'protect pdf with password, encrypt pdf online free, pdf password protection, secure pdf, add password to pdf, pdf encryption, lock pdf file',
  canonical: SITE_URL + '/protect',
  jsonLd: [
    makeWebApp(
      'Protect PDF with Password — LS PDF',
      SITE_URL + '/protect',
      'Encrypt your PDF with a strong password using AES encryption. Prevent unauthorized access to sensitive documents. No file uploads — fully client-side.',
      ['AES 256-bit encryption', 'Set user and owner passwords', 'Control print/copy permissions', 'Instant local encryption']
    ),
    makeFAQ([
      {
        q: 'How do I add a password to a PDF for free?',
        a: 'Upload your PDF to LS PDF Protect, enter your desired password, and click Encrypt. The password-protected PDF downloads instantly — no account required.',
      },
      {
        q: 'What encryption standard does LS PDF use?',
        a: 'LS PDF uses AES encryption, the same standard used by banks and governments to protect sensitive data.',
      },
      {
        q: 'Can I restrict printing or copying from the PDF?',
        a: 'Yes. LS PDF allows you to set permissions, restricting printing, copying, and editing of the protected PDF.',
      },
    ]),
  ],
}

// ─── UNLOCK PDF ──────────────────────────────────────────────────────────────
export const unlockSEO: ToolSEOData = {
  title: 'Unlock PDF Online Free — Remove Password from PDF | LS PDF',
  description:
    'Remove password protection from your PDF instantly. Enter the password once and download an unlocked copy. Free, 100% client-side, no file upload required.',
  keywords:
    'unlock pdf online, remove pdf password, pdf password remover free, decrypt pdf, unlock protected pdf, pdf unlocker, remove pdf restrictions',
  canonical: SITE_URL + '/unlock',
  jsonLd: [
    makeWebApp(
      'Unlock PDF Online — LS PDF',
      SITE_URL + '/unlock',
      'Remove password protection from PDF files you own. Enter the password to unlock and download a restriction-free copy. 100% private — no uploads.',
      ['Remove user passwords', 'Remove owner restrictions', 'Supports AES encrypted PDFs', 'Instant local processing']
    ),
    makeFAQ([
      {
        q: 'How do I remove a password from a PDF file?',
        a: 'Upload your password-protected PDF to LS PDF Unlock, enter the correct password, and click Unlock. An unrestricted copy downloads immediately.',
      },
      {
        q: 'Can LS PDF crack a PDF password I forgot?',
        a: 'No. LS PDF requires you to know the correct password. It decrypts the PDF using your provided password — it does not perform brute-force cracking.',
      },
      {
        q: 'Is it legal to unlock a PDF?',
        a: 'It is legal to remove password protection from PDFs you own or have permission to modify. Always ensure you have the right to access the document.',
      },
    ]),
  ],
}

// ─── ROTATE PDF ──────────────────────────────────────────────────────────────
export const rotateSEO: ToolSEOData = {
  title: 'Rotate PDF Pages Online Free — Fix PDF Orientation | LS PDF',
  description:
    'Rotate PDF pages 90°, 180°, or 270° to fix orientation permanently. Rotate all pages or select individual pages. Free, no upload, instant results in your browser.',
  keywords:
    'rotate pdf online, fix pdf orientation, rotate pdf pages free, turn pdf page, pdf rotation tool, rotate pdf 90 degrees, rotate single page pdf',
  canonical: SITE_URL + '/rotate-pdf',
  jsonLd: [
    makeWebApp(
      'Rotate PDF Pages — LS PDF',
      SITE_URL + '/rotate-pdf',
      'Rotate PDF pages 90°, 180°, or 270° to permanently fix orientation. Apply rotation to all pages or individual pages. Client-side only.',
      ['Rotate all pages or individual pages', '90°, 180°, 270° rotation options', 'Visual page thumbnails', 'Permanent rotation saved to PDF']
    ),
    makeFAQ([
      {
        q: 'How do I rotate a PDF page permanently?',
        a: 'Upload your PDF to LS PDF Rotate, select which pages to rotate, choose the rotation angle (90°, 180°, or 270°), and download. The rotation is saved permanently in the file.',
      },
      {
        q: 'Can I rotate only specific pages in a PDF?',
        a: 'Yes. LS PDF lets you select individual pages or groups of pages to rotate, leaving others unchanged.',
      },
    ]),
  ],
}

// ─── REARRANGE PDF ───────────────────────────────────────────────────────────
export const rearrangeSEO: ToolSEOData = {
  title: 'Rearrange PDF Pages Online Free — Reorder PDF | LS PDF',
  description:
    'Drag and drop to reorder PDF pages visually. Delete unwanted pages and rearrange your document layout. Free, no upload, runs 100% in your browser.',
  keywords:
    'rearrange pdf pages, reorder pdf pages online, drag and drop pdf pages, pdf page organizer, reorganize pdf, sort pdf pages, reorder pdf free',
  canonical: SITE_URL + '/rearrange-pdf',
  jsonLd: [
    makeWebApp(
      'Rearrange PDF Pages — LS PDF',
      SITE_URL + '/rearrange-pdf',
      'Drag and drop to visually reorder PDF pages. Delete pages, change the page order, and save the reorganized PDF. 100% client-side.',
      ['Drag-and-drop page reordering', 'Visual thumbnail preview', 'Delete individual pages', 'Multi-page selection']
    ),
    makeFAQ([
      {
        q: 'How do I change the order of pages in a PDF?',
        a: 'Upload your PDF to LS PDF Rearrange, then drag and drop the page thumbnails to reorder them. Click Save when done to download the reorganized PDF.',
      },
      {
        q: 'Can I delete pages while rearranging?',
        a: 'Yes. While in the rearrange view, you can remove individual pages you do not want in the final document.',
      },
    ]),
  ],
}

// ─── PAGE NUMBERS ────────────────────────────────────────────────────────────
export const pageNumbersSEO: ToolSEOData = {
  title: 'Add Page Numbers to PDF Online Free | LS PDF',
  description:
    'Automatically add page numbers to your PDF. Customize position (header/footer), format, and starting number. Free, no upload, instant results in your browser.',
  keywords:
    'add page numbers to pdf, pdf page numbering, pdf header footer, number pdf pages online, page number pdf free, pdf pagination tool',
  canonical: SITE_URL + '/page-numbers',
  jsonLd: [
    makeWebApp(
      'Add Page Numbers to PDF — LS PDF',
      SITE_URL + '/page-numbers',
      'Add customizable page numbers to your PDF. Choose position (header/footer/corners), number format, and starting number. 100% client-side.',
      ['Custom position (corners, center)', 'Multiple number formats', 'Custom start number', 'Font size and color options']
    ),
    makeFAQ([
      {
        q: 'How do I add page numbers to a PDF for free?',
        a: 'Upload your PDF to LS PDF Page Numbers, configure the position, format, and starting number, then click Apply. The numbered PDF downloads instantly.',
      },
      {
        q: 'Can I choose where page numbers appear (header or footer)?',
        a: 'Yes. LS PDF lets you place page numbers in the header or footer, and position them left, center, or right.',
      },
    ]),
  ],
}

// ─── WATERMARK ───────────────────────────────────────────────────────────────
export const watermarkSEO: ToolSEOData = {
  title: 'Add Watermark to PDF Online Free — Text Watermark | LS PDF',
  description:
    'Add custom text watermarks to your PDF for branding, security, or confidentiality marking. Adjust opacity, angle, font, and position. Free, no upload.',
  keywords:
    'add watermark to pdf, pdf watermark online free, text watermark pdf, confidential watermark pdf, pdf branding, watermark pdf pages, draft watermark pdf',
  canonical: SITE_URL + '/watermark',
  jsonLd: [
    makeWebApp(
      'Add Watermark to PDF — LS PDF',
      SITE_URL + '/watermark',
      'Overlay custom text watermarks on every PDF page. Customize text, font, opacity, angle, color, and position. 100% client-side processing.',
      ['Custom text watermark', 'Adjustable opacity and rotation', 'Font and color customization', 'Apply to all or specific pages']
    ),
    makeFAQ([
      {
        q: 'How do I add a watermark to a PDF for free?',
        a: 'Upload your PDF to LS PDF Watermark, enter your watermark text, customize the appearance, and click Apply. The watermarked PDF downloads instantly.',
      },
      {
        q: 'Can I add a "CONFIDENTIAL" or "DRAFT" watermark?',
        a: 'Yes. You can type any text as your watermark, including "CONFIDENTIAL," "DRAFT," your company name, or any custom message.',
      },
    ]),
  ],
}

// ─── METADATA ────────────────────────────────────────────────────────────────
export const metadataSEO: ToolSEOData = {
  title: 'Edit PDF Metadata Online Free — Remove PDF Info | LS PDF',
  description:
    'Edit or remove PDF metadata including title, author, subject, keywords, creator, and producer. Clean metadata for privacy. Free, no upload, 100% client-side.',
  keywords:
    'edit pdf metadata, remove pdf metadata, pdf document properties, pdf author editor, clean pdf metadata, pdf privacy, strip pdf info, pdf creator editor',
  canonical: SITE_URL + '/metadata',
  jsonLd: [
    makeWebApp(
      'Edit PDF Metadata — LS PDF',
      SITE_URL + '/metadata',
      'View and edit PDF metadata properties: title, author, subject, keywords, creator, and producer. Deep-clean metadata for privacy. 100% client-side.',
      ['Edit all standard PDF metadata fields', 'Deep-clean to remove identifying information', 'View existing metadata', 'Supports XMP metadata stripping']
    ),
    makeFAQ([
      {
        q: 'How do I edit the metadata of a PDF?',
        a: 'Upload your PDF to LS PDF Metadata, edit fields like title, author, and subject, then save. The updated PDF downloads with your new metadata.',
      },
      {
        q: 'Why should I edit PDF metadata for privacy?',
        a: 'PDFs often contain hidden metadata like the author name, creation software, and timestamps. Removing or editing this protects your identity and prevents information leakage.',
      },
      {
        q: 'Can I remove all metadata from a PDF?',
        a: 'Yes. LS PDF offers a "Deep Clean" option that strips all identifying metadata from your PDF, including producer, creator, and XMP data.',
      },
    ]),
  ],
}

// ─── SIGNATURE ───────────────────────────────────────────────────────────────
export const signatureSEO: ToolSEOData = {
  title: 'Add Electronic Signature to PDF Free — Sign PDF Online | LS PDF',
  description:
    'Draw, type, or upload your signature and add it to any PDF. Sign documents online for free, no upload, no account. Your signature never leaves your device.',
  keywords:
    'sign pdf online free, add signature to pdf, electronic signature pdf, e-signature pdf, draw signature pdf, digital signature pdf, sign document online',
  canonical: SITE_URL + '/signature',
  jsonLd: [
    makeWebApp(
      'Sign PDF Online — LS PDF',
      SITE_URL + '/signature',
      'Add your electronic signature to any PDF. Draw with mouse/touch, type, or upload a signature image. Place it anywhere on the document. 100% private.',
      ['Draw signature with mouse or touch', 'Type signature in custom fonts', 'Upload signature image', 'Drag to position on any page']
    ),
    makeFAQ([
      {
        q: 'How do I electronically sign a PDF for free?',
        a: 'Open LS PDF Signature, upload your PDF, draw or type your signature, drag it to the correct position, and download the signed document — all free and without creating an account.',
      },
      {
        q: 'Is an electronic signature from LS PDF legally valid?',
        a: 'Electronic signatures are legally recognized in many countries under laws like the ESIGN Act (USA) and eIDAS (EU) for most document types. Always check the requirements for your specific use case.',
      },
      {
        q: 'Is my signature private and secure?',
        a: 'Yes. Your signature image is created and applied entirely within your browser. It is never transmitted to any server.',
      },
    ]),
  ],
}

// ─── GRAYSCALE ───────────────────────────────────────────────────────────────
export const grayscaleSEO: ToolSEOData = {
  title: 'Convert PDF to Grayscale Online Free — Black & White PDF | LS PDF',
  description:
    'Convert all pages of a PDF to black and white (grayscale) to reduce color ink usage or meet specific document requirements. Free, no upload, instant in browser.',
  keywords:
    'convert pdf to grayscale, black and white pdf, pdf grayscale converter free, remove color from pdf, pdf to black white, grayscale pdf online',
  canonical: SITE_URL + '/grayscale',
  jsonLd: [
    makeWebApp(
      'Convert PDF to Grayscale — LS PDF',
      SITE_URL + '/grayscale',
      'Convert PDF pages to grayscale (black and white) to save color ink or meet document standards. Fast client-side processing.',
      ['Convert all pages to grayscale', 'Reduces color ink consumption for printing', 'Maintains text sharpness', 'Reduces file size']
    ),
    makeFAQ([
      {
        q: 'How do I convert a PDF to black and white?',
        a: 'Upload your PDF to LS PDF Grayscale and click Convert. All pages are converted to grayscale and the result downloads automatically.',
      },
      {
        q: 'Why convert a PDF to grayscale?',
        a: 'Grayscale PDFs use less color ink when printing, may be required by some printers or institutions, and can result in smaller file sizes.',
      },
    ]),
  ],
}

// ─── PDF TO IMAGE ─────────────────────────────────────────────────────────────
export const pdfToImageSEO: ToolSEOData = {
  title: 'PDF to Image Online Free — Convert PDF Pages to JPG/PNG | LS PDF',
  description:
    'Convert PDF pages to high-quality JPG or PNG images. Choose resolution (DPI), select specific pages. Free, no upload, processes entirely in your browser.',
  keywords:
    'pdf to image online, convert pdf to jpg free, pdf to png converter, pdf to jpeg online, pdf page to image, export pdf as image, screenshot pdf',
  canonical: SITE_URL + '/pdf-to-image',
  jsonLd: [
    makeWebApp(
      'PDF to Image Converter — LS PDF',
      SITE_URL + '/pdf-to-image',
      'Convert PDF pages to high-quality JPG or PNG images. Select specific pages, customize resolution (DPI), and download as a ZIP archive. 100% client-side.',
      ['Convert to JPG or PNG', 'Custom DPI/resolution settings', 'Select individual pages', 'Download all as ZIP']
    ),
    makeFAQ([
      {
        q: 'How do I convert a PDF to an image for free?',
        a: 'Upload your PDF to LS PDF PDF-to-Image, select the pages and format (JPG/PNG), adjust quality settings, and download. No account required.',
      },
      {
        q: 'What image formats can I convert PDF to?',
        a: 'LS PDF supports conversion to JPG (JPEG) and PNG formats, with customizable quality and resolution settings.',
      },
      {
        q: 'Can I convert just one specific page to an image?',
        a: 'Yes. LS PDF lets you select individual pages to convert rather than converting the entire document.',
      },
    ]),
  ],
}

// ─── IMAGE TO PDF ─────────────────────────────────────────────────────────────
export const imageToPdfSEO: ToolSEOData = {
  title: 'Image to PDF Online Free — Convert JPG, PNG to PDF | LS PDF',
  description:
    'Convert JPG, PNG, and WebP images to a professional PDF document. Add multiple images, reorder them, and control page size. Free, no upload, runs in your browser.',
  keywords:
    'image to pdf online, jpg to pdf free, png to pdf converter, convert photos to pdf, photo to pdf, jpeg to pdf online, webp to pdf, pictures to pdf',
  canonical: SITE_URL + '/image-to-pdf',
  jsonLd: [
    makeWebApp(
      'Image to PDF Converter — LS PDF',
      SITE_URL + '/image-to-pdf',
      'Convert one or multiple JPG, PNG, or WebP images into a professional PDF. Reorder images, choose page size, and download instantly. 100% client-side.',
      ['Supports JPG, PNG, WebP formats', 'Combine multiple images into one PDF', 'Custom page size options', 'Drag-and-drop image ordering']
    ),
    makeFAQ([
      {
        q: 'How do I convert images to a PDF for free?',
        a: 'Upload your images (JPG, PNG, or WebP) to LS PDF Image-to-PDF, reorder if needed, and click Convert. Your PDF downloads in seconds — no sign-up required.',
      },
      {
        q: 'Can I combine multiple images into one PDF?',
        a: 'Yes. You can upload multiple images and they will each become a page in the resulting PDF. You can drag to reorder them before converting.',
      },
      {
        q: 'What image formats are supported?',
        a: 'LS PDF Image to PDF supports JPG/JPEG, PNG, and WebP image formats.',
      },
    ]),
  ],
}

// ─── EXTRACT IMAGES ───────────────────────────────────────────────────────────
export const extractImagesSEO: ToolSEOData = {
  title: 'Extract Images from PDF Online Free | LS PDF',
  description:
    'Extract and download all embedded images from a PDF document. Get original-quality images without any server upload. Free, private, runs in your browser.',
  keywords:
    'extract images from pdf, pdf image extractor, pull images from pdf, save images from pdf, pdf to images, get images from pdf free, pdf image download',
  canonical: SITE_URL + '/extract-images',
  jsonLd: [
    makeWebApp(
      'Extract Images from PDF — LS PDF',
      SITE_URL + '/extract-images',
      'Pull out all original embedded images from a PDF document. Download them individually or as a ZIP archive. 100% client-side, no uploads.',
      ['Extracts all embedded images', 'Original image quality preserved', 'Download as ZIP archive', 'Supports PNG, JPEG, and other embedded formats']
    ),
    makeFAQ([
      {
        q: 'How do I extract images from a PDF for free?',
        a: 'Upload your PDF to LS PDF Extract Images, and all embedded images will be detected and listed. Download them individually or all at once as a ZIP file.',
      },
      {
        q: 'Are the extracted images in their original quality?',
        a: 'Yes. LS PDF extracts images as they are embedded in the PDF, preserving their original resolution and quality.',
      },
    ]),
  ],
}

// ─── PDF TO TEXT ──────────────────────────────────────────────────────────────
export const pdfToTextSEO: ToolSEOData = {
  title: 'PDF to Text Online Free — Extract Text from PDF (OCR) | LS PDF',
  description:
    'Extract plain text from PDF documents, including scanned PDFs using OCR (Optical Character Recognition). Copy or download the extracted text. Free, no upload.',
  keywords:
    'pdf to text online, extract text from pdf, pdf text extractor free, ocr pdf online, pdf ocr tool, copy text from pdf, scanned pdf to text',
  canonical: SITE_URL + '/pdf-to-text',
  jsonLd: [
    makeWebApp(
      'PDF to Text (OCR) — LS PDF',
      SITE_URL + '/pdf-to-text',
      'Extract plain text from PDF documents. Includes OCR support for scanned or image-based PDFs using Tesseract.js — all processing done locally in your browser.',
      ['Standard PDF text extraction', 'OCR for scanned PDFs using Tesseract.js', 'Copy or download extracted text', 'Multi-page support']
    ),
    makeFAQ([
      {
        q: 'How do I extract text from a PDF for free?',
        a: 'Upload your PDF to LS PDF PDF-to-Text, and the text content will be extracted. For scanned PDFs, enable OCR mode to recognize text from images.',
      },
      {
        q: 'Can LS PDF extract text from scanned PDFs?',
        a: 'Yes. LS PDF uses Tesseract.js, an open-source OCR engine running entirely in your browser, to recognize and extract text from scanned or image-based PDFs.',
      },
      {
        q: 'Is OCR processing private?',
        a: 'Yes. The Tesseract.js OCR engine runs locally in your browser using WebAssembly. No image data is sent to any server.',
      },
    ]),
  ],
}

// ─── REPAIR PDF ───────────────────────────────────────────────────────────────
export const repairSEO: ToolSEOData = {
  title: 'Repair Corrupted PDF Online Free — Fix PDF File | LS PDF',
  description:
    'Attempt to repair and recover data from corrupted, damaged, or unreadable PDF files. Fix common PDF errors in your browser. Free, no upload required.',
  keywords:
    'repair pdf online, fix corrupted pdf, pdf repair tool free, recover damaged pdf, broken pdf fix, pdf file repair, corrupted pdf recovery',
  canonical: SITE_URL + '/repair',
  jsonLd: [
    makeWebApp(
      'Repair PDF — LS PDF',
      SITE_URL + '/repair',
      'Attempt to recover and repair corrupted or damaged PDF files. Fix common structural errors to make PDFs readable again. 100% client-side processing.',
      ['Recovers corrupted PDF structures', 'Fixes common PDF syntax errors', 'Attempts to restore readable content', 'No data sent to any server']
    ),
    makeFAQ([
      {
        q: 'How do I fix a corrupted PDF file?',
        a: 'Upload your damaged PDF to LS PDF Repair. The tool will attempt to analyze and reconstruct the PDF structure to make it readable. Download the repaired file.',
      },
      {
        q: 'Can LS PDF fix all types of PDF corruption?',
        a: 'LS PDF can fix many common PDF errors, but severely corrupted files where core data is lost may not be fully recoverable. The tool will attempt the best possible repair.',
      },
    ]),
  ],
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
export const aboutSEO: ToolSEOData = {
  title: 'About LS PDF — Privacy-First PDF Tools | Zero Server Architecture',
  description:
    'Learn how LS PDF works. A privacy-first, open-source PDF toolkit with zero server infrastructure. All processing happens locally in your browser using WebAssembly.',
  keywords:
    'about ls pdf, privacy pdf tools, client side pdf processing, open source pdf tool, no server pdf, webassembly pdf, local pdf processing, free open source pdf',
  canonical: SITE_URL + '/about',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LS PDF',
    url: SITE_URL,
    description:
      'LS PDF is an open-source, privacy-first PDF toolkit. All tools run 100% client-side in the browser using WebAssembly. No servers, no tracking, no cost.',
    foundingDate: '2026',
    sameAs: ['https://github.com/girishlade111/LS-PDF'],
    knowsAbout: [
      'PDF processing',
      'Client-side web applications',
      'Privacy-preserving software',
      'WebAssembly',
      'Open-source software',
    ],
  },
}

// ─── PRIVACY POLICY ───────────────────────────────────────────────────────────
export const privacySEO: ToolSEOData = {
  title: 'Privacy Policy — LS PDF | No Data Collection, No Tracking',
  description:
    'LS PDF collects zero user data. No analytics, no cookies, no server-side processing. Read our privacy specification to understand how your files and data are handled.',
  keywords:
    'ls pdf privacy policy, pdf tool privacy, no data collection pdf, private pdf processing, cookie-free pdf tool, gdpr pdf tool',
  canonical: SITE_URL + '/privacy',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'LS PDF Privacy Policy',
    url: SITE_URL + '/privacy',
    description:
      'Privacy specification for LS PDF. Explains how user files and data are handled — entirely client-side with no collection or transmission to servers.',
    inLanguage: 'en',
  },
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
export const settingsSEO: ToolSEOData = {
  title: 'Settings — LS PDF | Preferences & Configuration',
  description:
    'Configure LS PDF settings — theme, auto-download, haptic feedback, activity history, and privacy preferences. All settings are stored locally on your device.',
  keywords:
    'ls pdf settings, pdf tool preferences, auto download pdf, pdf tool configuration, privacy settings, theme settings, haptic feedback',
  canonical: SITE_URL + '/settings',
  robots: 'noindex, nofollow',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'LS PDF Settings',
    url: SITE_URL + '/settings',
    description: 'User preferences and configuration panel for the LS PDF toolkit.',
    inLanguage: 'en',
  },
}
