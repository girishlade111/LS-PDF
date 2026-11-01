/**
 * LS PDF — Tool Guide & Architectural Documentation Data
 * 
 * Provides verified, implementation-accurate technical specifications,
 * step-by-step instructions, transparent limitations, FAQs, and related tools
 * for all 17 PDF utilities.
 */

export interface ToolSpecItem {
  label: string
  value: string
}

export interface ToolFAQItem {
  q: string
  a: string
}

export interface RelatedToolItem {
  slug: string
  title: string
  desc: string
}

export interface ToolGuideData {
  slug: string
  title: string
  h1: string
  summary: string
  whatItDoes: string[]
  howTo: string[]
  specs: ToolSpecItem[]
  faqs: ToolFAQItem[]
  related: RelatedToolItem[]
}

export const TOOL_GUIDES: Record<string, ToolGuideData> = {
  merge: {
    slug: 'merge',
    title: 'Merge PDF',
    h1: 'Merge PDF Files Online Free',
    summary: 'Combine multiple PDF documents into a single organized file in seconds. Drag and drop to reorder pages and files with zero quality degradation.',
    whatItDoes: [
      'LS PDF Merge reads multiple PDF documents directly into your browser memory and combines them into a single coherent document using pdf-lib.',
      'You can freely rearrange documents or individual pages with interactive drag-and-drop reordering, apply per-file rotations, and preserve existing vector text, form fields, and embedded annotations without re-compressing contents.',
      'All processing runs entirely on your local machine using client-side JavaScript. No document bytes, file names, or metadata ever leave your computer or mobile device.'
    ],
    howTo: [
      'Upload two or more PDF files by tapping Select PDF Files or dragging them into the browser window.',
      'Drag and drop the file cards to arrange them in your preferred reading order.',
      'Optionally rotate individual documents or unlock password-protected files if prompted.',
      'Click Merge PDF to assemble the files locally, then save your merged document instantly.'
    ],
    specs: [
      { label: 'Supported Inputs', value: 'PDF 1.0 to 2.0 (.pdf)' },
      { label: 'Output Format', value: 'Clean, consolidated PDF (.pdf)' },
      { label: 'Processing Location', value: '100% In-Browser Memory (pdf-lib)' },
      { label: 'Privacy & Telemetry', value: 'Zero file uploads, zero server processing' },
      { label: 'File Limits', value: 'Bounded only by your device RAM (tested with 100+ MB)' }
    ],
    faqs: [
      {
        q: 'How do I merge PDF files online for free?',
        a: 'Upload your PDF files to LS PDF Merge tool, drag to reorder if needed, then click Merge. Your combined PDF downloads instantly — no account or payment required.'
      },
      {
        q: 'Are my files uploaded to a server when I merge PDFs?',
        a: 'No. LS PDF processes everything 100% in your browser using WebAssembly. Your files never leave your device and are never sent to any server.'
      },
      {
        q: 'Is there a limit to how many PDFs I can merge?',
        a: 'There is no artificial limit. You can merge as many PDFs as your browser can handle in memory.'
      },
      {
        q: 'Can I merge password-protected PDFs?',
        a: 'Yes. LS PDF will ask you for the password and unlock the file locally in your browser before merging.'
      }
    ],
    related: [
      { slug: 'split', title: 'Split PDF', desc: 'Extract specific page ranges into separate files.' },
      { slug: 'rearrange-pdf', title: 'Rearrange PDF', desc: 'Visually reorder or delete individual pages.' },
      { slug: 'compress', title: 'Compress PDF', desc: 'Reduce the final merged file size for email sharing.' }
    ]
  },

  split: {
    slug: 'split',
    title: 'Split PDF',
    h1: 'Split PDF Online Free',
    summary: 'Extract specific pages or page ranges into standalone PDF documents or export all pages as individual files in an organized ZIP archive.',
    whatItDoes: [
      'LS PDF Split analyzes your document structure and lets you extract any subset of pages with precision.',
      'You can select individual pages visually from rendered thumbnails, specify page ranges (such as 1-5, 8, 11-14), or split an entire book into separate single-page documents packed into a ZIP archive.',
      'Extraction extracts pristine original PDF objects without re-encoding, preserving sharp typography, vector graphics, and embedded metadata.'
    ],
    howTo: [
      'Select or drop your PDF document into the tool.',
      'Choose your split mode: Single PDF (combining selected pages) or Individual Pages (ZIP archive).',
      'Click thumbnails to select pages or type custom page ranges into the range input.',
      'Click Split PDF to generate and download your extracted files.'
    ],
    specs: [
      { label: 'Supported Inputs', value: 'Any standard PDF document (.pdf)' },
      { label: 'Output Formats', value: 'Single extracted PDF or multi-file ZIP archive' },
      { label: 'Processing Engine', value: 'pdf-lib & Web Workers for background extraction' },
      { label: 'Privacy Architecture', value: '100% client-side execution; zero network transmission' }
    ],
    faqs: [
      {
        q: 'How do I split a PDF online for free?',
        a: 'Upload your PDF, visually select the pages or ranges you want to extract, then click Split. The result downloads immediately — no sign-up needed.'
      },
      {
        q: 'Can I extract just specific pages from a PDF?',
        a: 'Yes. LS PDF lets you select individual pages or define custom ranges (e.g., pages 1–5, 8, 10–12) to extract.'
      },
      {
        q: 'Is it safe to split a confidential PDF using LS PDF?',
        a: 'Yes. All processing happens locally in your browser. Your PDF is never uploaded to any server, making it completely private.'
      }
    ],
    related: [
      { slug: 'merge', title: 'Merge PDF', desc: 'Combine multiple documents into one.' },
      { slug: 'rearrange-pdf', title: 'Rearrange PDF', desc: 'Reorder pages within your document.' },
      { slug: 'rotate-pdf', title: 'Rotate PDF', desc: 'Permanently orient portrait or landscape pages.' }
    ]
  },

  compress: {
    slug: 'compress',
    title: 'Compress PDF',
    h1: 'Compress PDF Online Free',
    summary: 'Reduce PDF file size for seamless email attachments and fast web uploads with an interactive quality slider.',
    whatItDoes: [
      'LS PDF Compress optimizes documents by re-sampling embedded graphics and reconstructing pages with configurable JPEG image compression.',
      'The interactive slider gives you immediate control over the balance between file size savings and visual clarity.',
      'Notice: Because this compression implementation rasterizes document pages onto canvases to compress embedded imagery, selectable vector text layers are converted into visual images. Actual file size savings and visual clarity depend on original document contents and selected quality settings.'
    ],
    howTo: [
      'Choose or drag your large PDF file into the upload zone.',
      'Adjust the compression slider to choose Low, Medium, or Maximum reduction.',
      'Inspect the estimated size savings and quality preview.',
      'Click Compress PDF to build the lightweight document and save it to your device.'
    ],
    specs: [
      { label: 'Supported Inputs', value: 'PDF files with embedded graphics or scans (.pdf)' },
      { label: 'Output Format', value: 'Optimized, compressed PDF (.pdf)' },
      { label: 'Compression Method', value: 'Canvas rasterization & JPEG stream re-sampling' },
      { label: 'Important Limitation', value: 'Converts vector text layers to raster images' },
      { label: 'Privacy', value: 'Zero cloud processing; runs on local Web Workers' }
    ],
    faqs: [
      {
        q: 'How do I compress a PDF to make it smaller?',
        a: 'Upload your PDF to LS PDF Compress, select your desired compression level (low, medium, or high), then download the compressed file. No account needed.'
      },
      {
        q: 'Will compressing a PDF reduce its quality?',
        a: 'LS PDF optimizes file size by rendering pages to canvas and re-encoding them as optimized JPEG images. While higher quality settings preserve clearer visuals, this rasterization process converts selectable text into images. Output file size and image clarity vary depending on original document content and selected compression settings.'
      },
      {
        q: 'Why is my PDF too large to email?',
        a: 'PDFs with many images or high-resolution graphics can be large. Use LS PDF Compress to reduce the size to under 10MB for email attachment limits.'
      },
      {
        q: 'Is there a maximum file size for PDF compression?',
        a: 'There is no server-imposed limit. The only limit is your browser\'s available memory, which handles most PDFs without issues.'
      }
    ],
    related: [
      { slug: 'grayscale', title: 'Convert to Grayscale', desc: 'Remove colors to further reduce printer ink and file size.' },
      { slug: 'merge', title: 'Merge PDF', desc: 'Combine documents after compressing.' },
      { slug: 'pdf-to-image', title: 'PDF to Image', desc: 'Export pages directly as JPG or PNG images.' }
    ]
  },

  protect: {
    slug: 'protect',
    title: 'Protect PDF',
    h1: 'Protect PDF with Password Free',
    summary: 'Secure confidential PDF documents with strong cryptographic encryption and granular permission restrictions.',
    whatItDoes: [
      'LS PDF Protect encrypts your documents directly in your browser using standard cryptographic algorithms via @pdfsmaller/pdf-encrypt-lite.',
      'You can configure an Owner Password (required to modify document settings) and a User Password (required to open and view the document).',
      'The tool also enforces permissions such as disabling unauthorized printing, copying of text, or modifying document annotations.'
    ],
    howTo: [
      'Select your PDF file to be encrypted.',
      'Enter a strong password of your choice in the password field.',
      'Optionally toggle permissions for document printing, copying, and annotating.',
      'Click Encrypt PDF to produce an encrypted document that requires a password to open.'
    ],
    specs: [
      { label: 'Encryption Algorithm', value: 'Standard AES Encryption' },
      { label: 'Password Security', value: 'Passwords never leave your device memory' },
      { label: 'Permission Controls', value: 'Printing, Content Copying, Form Filling, Annotations' },
      { label: 'Output Compatibility', value: 'Adobe Acrobat, Apple Preview, Chrome, Edge, Mobile' }
    ],
    faqs: [
      {
        q: 'How do I add a password to a PDF for free?',
        a: 'Upload your PDF to LS PDF Protect, enter your desired password, and click Encrypt. The password-protected PDF downloads instantly — no account required.'
      },
      {
        q: 'What encryption standard does LS PDF use?',
        a: 'LS PDF uses AES encryption, the same standard used by banks and governments to protect sensitive data.'
      },
      {
        q: 'Can I restrict printing or copying from the PDF?',
        a: 'Yes. LS PDF allows you to set permissions, restricting printing, copying, and editing of the protected PDF.'
      }
    ],
    related: [
      { slug: 'unlock', title: 'Unlock PDF', desc: 'Remove passwords from protected documents.' },
      { slug: 'metadata', title: 'Edit Metadata', desc: 'Sanitize hidden author and tracking metadata.' },
      { slug: 'watermark', title: 'Watermark PDF', desc: 'Add confidential branding or security stamps.' }
    ]
  },

  unlock: {
    slug: 'unlock',
    title: 'Unlock PDF',
    h1: 'Unlock PDF Online Free',
    summary: 'Remove known passwords and security restrictions from PDF documents you own for easy archiving and sharing.',
    whatItDoes: [
      'LS PDF Unlock accepts your valid document password and decrypts the underlying PDF data streams locally in your browser.',
      'Once decrypted, it generates a clean, unrestricted PDF copy that opens instantly without prompting for credentials in any PDF viewer.',
      'Important Distinction: This tool decrypts PDFs using the legitimate password provided by you. It does not perform illegal brute-force attacks or crack unknown passwords.'
    ],
    howTo: [
      'Upload your password-protected PDF document.',
      'Type the valid password that was used to secure the document.',
      'Click Unlock PDF to remove encryption and restrictions.',
      'Download your unlocked, permanent copy of the PDF.'
    ],
    specs: [
      { label: 'Supported Cryptography', value: 'Standard PDF Security Handlers (AES/RC4)' },
      { label: 'Requirement', value: 'Valid user or owner password is required' },
      { label: 'Cracking Limitation', value: 'Does not crack or guess unknown passwords' },
      { label: 'Privacy', value: 'Passwords and files remain strictly inside your browser' }
    ],
    faqs: [
      {
        q: 'How do I remove a password from a PDF file?',
        a: 'Upload your password-protected PDF to LS PDF Unlock, enter the correct password, and click Unlock. An unrestricted copy downloads immediately.'
      },
      {
        q: 'Can LS PDF crack a PDF password I forgot?',
        a: 'No. LS PDF requires you to know the correct password. It decrypts the PDF using your provided password — it does not perform brute-force cracking.'
      },
      {
        q: 'Is it legal to unlock a PDF?',
        a: 'It is legal to remove password protection from PDFs you own or have permission to modify. Always ensure you have the right to access the document.'
      }
    ],
    related: [
      { slug: 'protect', title: 'Protect PDF', desc: 'Encrypt files with new secure passwords.' },
      { slug: 'metadata', title: 'Edit Metadata', desc: 'Inspect document properties and tags.' },
      { slug: 'split', title: 'Split PDF', desc: 'Extract pages from unlocked documents.' }
    ]
  },

  'rotate-pdf': {
    slug: 'rotate-pdf',
    title: 'Rotate PDF',
    h1: 'Rotate PDF Pages Online Free',
    summary: 'Permanently fix orientation on upside-down or sideways PDF pages with live visual previews.',
    whatItDoes: [
      'LS PDF Rotate updates the internal rotation flags (`/Rotate`) in your document\'s page dictionary.',
      'You can rotate all pages simultaneously by 90°, 180°, or 270°, or selectively click individual pages to orient them independently.',
      'Because only the rotation metadata is updated, the operation is instantaneous and maintains 100% original quality without re-compressing text or images.'
    ],
    howTo: [
      'Load your PDF file into the visual rotation workspace.',
      'Click the global Rotate Left or Rotate Right buttons to rotate every page.',
      'Or hover and tap the rotation icon on specific pages to correct individual orientations.',
      'Click Save PDF to write the permanent orientation changes and download your file.'
    ],
    specs: [
      { label: 'Angles Supported', value: '90° Clockwise, 180°, 270° (90° Counter-Clockwise)' },
      { label: 'Quality Impact', value: 'Zero quality loss; lossless metadata dictionary update' },
      { label: 'Selection Modes', value: 'All pages, Even/Odd pages, or individual page selection' },
      { label: 'Privacy', value: 'Operates 100% locally in browser memory' }
    ],
    faqs: [
      {
        q: 'How do I rotate a PDF page permanently?',
        a: 'Upload your PDF to LS PDF Rotate, select which pages to rotate, choose the rotation angle (90°, 180°, or 270°), and download. The rotation is saved permanently in the file.'
      },
      {
        q: 'Can I rotate only specific pages in a PDF?',
        a: 'Yes. LS PDF lets you select individual pages or groups of pages to rotate, leaving others unchanged.'
      }
    ],
    related: [
      { slug: 'rearrange-pdf', title: 'Rearrange PDF', desc: 'Reorder pages visually with drag-and-drop.' },
      { slug: 'merge', title: 'Merge PDF', desc: 'Combine rotated files into a master document.' },
      { slug: 'split', title: 'Split PDF', desc: 'Extract correctly oriented page sections.' }
    ]
  },

  'rearrange-pdf': {
    slug: 'rearrange-pdf',
    title: 'Rearrange PDF',
    h1: 'Rearrange PDF Pages Online Free',
    summary: 'Organize document page order with fluid drag-and-drop thumbnails powered by accessible touch and mouse controls.',
    whatItDoes: [
      'LS PDF Rearrange renders small, fast thumbnail representations of every page in your document.',
      'You can drag pages into any position, delete unwanted or blank pages, and duplicate pages where necessary.',
      'When saved, a new PDF structure is generated using pdf-lib that references the original content streams in your new custom page order.'
    ],
    howTo: [
      'Upload the PDF document you wish to reorganize.',
      'Drag and drop the page tiles into your intended order.',
      'Click the trash icon on any unwanted pages to remove them.',
      'Click Apply & Save to download your reorganized document.'
    ],
    specs: [
      { label: 'Interaction Engine', value: '@dnd-kit accessible drag-and-drop' },
      { label: 'Operations', value: 'Reorder, Delete page, Duplicate page' },
      { label: 'Performance', value: 'Lightweight thumbnail rendering with canvas caching' },
      { label: 'Privacy', value: 'Executed 100% in client memory' }
    ],
    faqs: [
      {
        q: 'How do I change the order of pages in a PDF?',
        a: 'Upload your PDF to LS PDF Rearrange, then drag and drop the page thumbnails to reorder them. Click Save when done to download the reorganized PDF.'
      },
      {
        q: 'Can I delete pages while rearranging?',
        a: 'Yes. While in the rearrange view, you can remove individual pages you do not want in the final document.'
      }
    ],
    related: [
      { slug: 'rotate-pdf', title: 'Rotate PDF', desc: 'Fix page orientation while organizing.' },
      { slug: 'split', title: 'Split PDF', desc: 'Extract pages into separate files.' },
      { slug: 'page-numbers', title: 'Page Numbers', desc: 'Add page numbers after reordering.' }
    ]
  },

  'page-numbers': {
    slug: 'page-numbers',
    title: 'Page Numbers',
    h1: 'Add Page Numbers to PDF Online Free',
    summary: 'Number document pages automatically with customizable typography, positions, offsets, and numbering formats.',
    whatItDoes: [
      'LS PDF Page Numbers stamps dynamic pagination numbers directly onto the content stream of every page in your document.',
      'You have complete control over position (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right), margins, font size, and format (e.g., "1", "Page 1", "Page 1 of 10").',
      'You can also specify a page offset to skip cover pages or start numbering from a specific index.'
    ],
    howTo: [
      'Upload your PDF document.',
      'Select your desired positioning on the page and choose a format.',
      'Adjust font size, margins, and starting page number offset.',
      'Click Number Pages to render and download your numbered PDF.'
    ],
    specs: [
      { label: 'Positions', value: '6 standard placements (Top & Bottom Left/Center/Right)' },
      { label: 'Format Templates', value: '"n", "Page n", "Page n of m", custom prefixes' },
      { label: 'Font Support', value: 'Standard PDF Helvetica / Times typography' },
      { label: 'Privacy', value: 'Zero cloud interaction; runs locally via pdf-lib' }
    ],
    faqs: [
      {
        q: 'How do I add page numbers to a PDF for free?',
        a: 'Upload your PDF to LS PDF Page Numbers, configure the position, format, and starting number, then click Apply. Your numbered PDF downloads in seconds.'
      },
      {
        q: 'Can I skip page numbering on the first page?',
        a: 'Yes. LS PDF allows you to set a page offset so your cover page or title page remains unnumbered.'
      }
    ],
    related: [
      { slug: 'watermark', title: 'Watermark PDF', desc: 'Add text branding or confidential labels.' },
      { slug: 'merge', title: 'Merge PDF', desc: 'Number your documents after combining them.' },
      { slug: 'metadata', title: 'Edit Metadata', desc: 'Add document title and author info.' }
    ]
  },

  watermark: {
    slug: 'watermark',
    title: 'Watermark',
    h1: 'Add Watermark to PDF Online Free',
    summary: 'Protect your intellectual property by overlaying customized text watermarks with control over opacity, angle, and size.',
    whatItDoes: [
      'LS PDF Watermark draws customizable text stamps over or behind the content of every page in your document.',
      'Common uses include stamping "CONFIDENTIAL", "DRAFT", company names, or copyright notices.',
      'You can fine-tune font size, color, opacity (transparency), and rotation angle to ensure clear visibility without obscuring important document text.'
    ],
    howTo: [
      'Select your PDF file to be watermarked.',
      'Type your watermark text into the input box.',
      'Configure the opacity slider, text color, rotation angle, and font size.',
      'Click Apply Watermark to generate and save your watermarked document.'
    ],
    specs: [
      { label: 'Watermark Type', value: 'Custom text strings with transparency support' },
      { label: 'Customization', value: 'Opacity (10%-100%), Angle (-90° to +90°), Color, Scale' },
      { label: 'Layering', value: 'Overlaid cleanly across all document pages' },
      { label: 'Privacy', value: '100% on-device document stamping' }
    ],
    faqs: [
      {
        q: 'How do I add a watermark to a PDF online for free?',
        a: 'Upload your PDF to LS PDF Watermark, type your custom watermark text, adjust opacity and angle, and click Apply. Your watermarked PDF is ready instantly.'
      },
      {
        q: 'Can I customize the watermark text and appearance?',
        a: 'Yes. You can customize the font size, rotation angle, opacity (transparency), and text content of the watermark.'
      }
    ],
    related: [
      { slug: 'page-numbers', title: 'Page Numbers', desc: 'Stamp page numbers alongside your watermark.' },
      { slug: 'protect', title: 'Protect PDF', desc: 'Lock watermarked documents with passwords.' },
      { slug: 'signature', title: 'Add Signature', desc: 'Place visual electronic signatures on documents.' }
    ]
  },

  metadata: {
    slug: 'metadata',
    title: 'Metadata',
    h1: 'Edit PDF Metadata Online Free',
    summary: 'View, edit, or deep-clean hidden document properties including title, author, subject, keywords, and creator stamps.',
    whatItDoes: [
      'PDF files frequently carry hidden tracking metadata such as computer usernames, author names, software versions, and creation timestamps.',
      'LS PDF Metadata lets you inspect all standard document properties and modify them to reflect accurate, professional information.',
      'The Deep Clean feature strips all identifying tags and creator stamps from the document dictionary for maximum personal and corporate privacy.'
    ],
    howTo: [
      'Upload your PDF document to inspect its current metadata.',
      'Review existing properties: Title, Author, Subject, Keywords, Creator, and Producer.',
      'Edit individual fields or click Deep Clean to wipe all identifying metadata.',
      'Click Save Metadata to download the sanitized PDF.'
    ],
    specs: [
      { label: 'Editable Fields', value: 'Title, Author, Subject, Keywords, Creator, Producer' },
      { label: 'Sanitization', value: 'One-click Deep Clean strips tracking tags' },
      { label: 'Format Compliance', value: 'Standard Info Dictionary & XMP Metadata' },
      { label: 'Privacy', value: 'All metadata parsing and editing occurs locally in RAM' }
    ],
    faqs: [
      {
        q: 'How do I edit the metadata of a PDF?',
        a: 'Upload your PDF to LS PDF Metadata, edit fields like title, author, and subject, then save. The updated PDF downloads with your new metadata.'
      },
      {
        q: 'Why should I edit PDF metadata for privacy?',
        a: 'PDFs often contain hidden metadata like the author name, creation software, and timestamps. Removing or editing this protects your identity and prevents information leakage.'
      },
      {
        q: 'Can I remove all metadata from a PDF?',
        a: 'Yes. LS PDF offers a "Deep Clean" option that strips all identifying metadata from your PDF, including producer, creator, and XMP data.'
      }
    ],
    related: [
      { slug: 'protect', title: 'Protect PDF', desc: 'Secure sanitized documents with encryption.' },
      { slug: 'grayscale', title: 'Convert to Grayscale', desc: 'Remove color tracking tags and print cleanly.' },
      { slug: 'repair', title: 'Repair PDF', desc: 'Fix damaged structural xref tables in PDFs.' }
    ]
  },

  signature: {
    slug: 'signature',
    title: 'Signature',
    h1: 'Add Electronic Signature to PDF Online Free',
    summary: 'Sign contracts and agreements directly in your browser by placing and resizing an uploaded signature image stamp.',
    whatItDoes: [
      'LS PDF Signature enables you to place and position an uploaded signature image (PNG, JPG, or WebP) directly onto document pages.',
      'You can drag your signature stamp onto any page, resize it to fit signature lines, and position it with precision.',
      'Important Distinction: This tool stamps a visual electronic signature onto document pages. It is not a cryptographic digital certificate (PKI/eIDAS hardware token), but satisfies standard electronic signing requirements for most agreements and forms.'
    ],
    howTo: [
      'Upload the PDF document requiring a signature.',
      'Upload your signature image (transparent PNG recommended).',
      'Navigate to the desired page and drag your signature onto the document.',
      'Resize and position your signature, then click Sign & Download.'
    ],
    specs: [
      { label: 'Signature Type', value: 'Visual Electronic Signature (Image stamp)' },
      { label: 'Supported Stamp Formats', value: 'PNG (transparent recommended), JPG, WebP image upload' },
      { label: 'Legal Distinction', value: 'Visual stamp; does not embed cryptographic PKI certificates' },
      { label: 'Privacy', value: 'Signature images and documents never leave your local device' }
    ],
    faqs: [
      {
        q: 'How do I electronically sign a PDF for free?',
        a: 'Open LS PDF Signature, upload your PDF, upload your signature image, position and resize it on the page, and download the signed document — all free and without creating an account.'
      },
      {
        q: 'Is an electronic signature from LS PDF legally valid?',
        a: 'This tool applies an image-based visual stamp onto document pages. It does not provide cryptographic digital certificates (PKI), biometric validation, or identity verification. Whether a visual signature is accepted depends on your jurisdiction and specific agreement requirements.'
      },
      {
        q: 'Is my signature private and secure?',
        a: 'Yes. Your signature image is processed and embedded entirely within your browser. It is never transmitted to any server.'
      }
    ],
    related: [
      { slug: 'protect', title: 'Protect PDF', desc: 'Password-protect documents after signing.' },
      { slug: 'watermark', title: 'Watermark PDF', desc: 'Add status or date stamps to agreements.' },
      { slug: 'merge', title: 'Merge PDF', desc: 'Combine signed forms with supporting attachments.' }
    ]
  },

  grayscale: {
    slug: 'grayscale',
    title: 'Grayscale',
    h1: 'Convert PDF to Grayscale Online Free',
    summary: 'Transform full-color PDF documents into black-and-white to help reduce color toner usage and create clean monochrome archives.',
    whatItDoes: [
      'LS PDF Grayscale renders document pages through client-side color-matrix filters, converting color images and graphics to monochrome grayscale values.',
      'This helps reduce color toner usage on office printers and produces clean monochrome contrast across pages.',
      'The conversion runs directly in your browser using canvas filters and Web Workers to process multi-page documents without server bottlenecks.'
    ],
    howTo: [
      'Select the color PDF document you wish to convert.',
      'Inspect the live black-and-white preview in the workspace.',
      'Click Convert to Grayscale to initiate on-device processing.',
      'Download your finished monochrome PDF.'
    ],
    specs: [
      { label: 'Color Conversion', value: 'Luminance-weighted monochrome grayscale' },
      { label: 'Use Case', value: 'Monochrome printing, visual standardization, black-and-white archiving' },
      { label: 'Engine', value: 'HTML5 Canvas & pdf-lib client assembly' },
      { label: 'Privacy', value: 'Zero server uploads; 100% on-device processing' }
    ],
    faqs: [
      {
        q: 'How do I convert a PDF to black and white?',
        a: 'Upload your PDF to LS PDF Grayscale and click Convert. All pages are converted to grayscale and the result downloads automatically.'
      },
      {
        q: 'Why convert a PDF to grayscale?',
        a: 'Converting to grayscale removes color elements to help reduce color toner usage when printing and provide uniform monochrome appearance. However, because pages are re-encoded via canvas rendering, conversion does not guarantee a smaller file size or compliance with specific institutional filing guidelines; use Compress PDF if size reduction is your primary goal.'
      }
    ],
    related: [
      { slug: 'compress', title: 'Compress PDF', desc: 'Further optimize file size after converting.' },
      { slug: 'pdf-to-image', title: 'PDF to Image', desc: 'Export monochrome pages as images.' },
      { slug: 'metadata', title: 'Edit Metadata', desc: 'Clean author tags from monochrome documents.' }
    ]
  },

  'pdf-to-image': {
    slug: 'pdf-to-image',
    title: 'PDF to Image',
    h1: 'PDF to Image Online Free',
    summary: 'Convert PDF document pages into high-resolution JPG or PNG images with individual page downloads or organized ZIP archives.',
    whatItDoes: [
      'LS PDF PDF to Image renders high-definition raster images of each document page using Mozilla\'s PDF.js rendering engine.',
      'You can select between JPG (ideal for smaller sizes) and PNG (ideal for sharp vector text and transparent backgrounds).',
      'Download individual pages as standalone images or grab the entire document packaged into a single ZIP archive.'
    ],
    howTo: [
      'Upload your PDF document into the converter.',
      'Choose your preferred image format (JPG or PNG) and rendering scale.',
      'Select specific pages or choose to convert the entire document.',
      'Download individual page images or click Download All (ZIP).'
    ],
    specs: [
      { label: 'Output Formats', value: 'JPG (JPEG), PNG, and ZIP archive' },
      { label: 'Rendering Engine', value: 'Mozilla PDF.js client-side canvas renderer' },
      { label: 'Resolution', value: 'Up to 2x High-DPI for crisp text and graphics' },
      { label: 'Privacy', value: '100% browser-local image generation' }
    ],
    faqs: [
      {
        q: 'How do I convert a PDF to an image for free?',
        a: 'Upload your PDF to LS PDF PDF-to-Image, select the pages and format (JPG/PNG), adjust quality settings, and download. No account required.'
      },
      {
        q: 'What image formats can I convert PDF to?',
        a: 'LS PDF supports conversion to JPG (JPEG) and PNG formats, with customizable quality and resolution settings.'
      },
      {
        q: 'Can I convert just one specific page to an image?',
        a: 'Yes. LS PDF lets you select individual pages to convert rather than converting the entire document.'
      }
    ],
    related: [
      { slug: 'image-to-pdf', title: 'Image to PDF', desc: 'Convert JPG, PNG, or WebP images back into a PDF.' },
      { slug: 'extract-images', title: 'Extract Images', desc: 'Extract embedded photos without page backgrounds.' },
      { slug: 'compress', title: 'Compress PDF', desc: 'Reduce file size before or after conversion.' }
    ]
  },

  'image-to-pdf': {
    slug: 'image-to-pdf',
    title: 'Image to PDF',
    h1: 'Image to PDF Online Free',
    summary: 'Convert photos and images (JPG, PNG, WebP) into professional, standardized PDF documents with drag-and-drop page ordering.',
    whatItDoes: [
      'LS PDF Image to PDF transforms your photo collections, receipts, scanned documents, and graphics into clean, standard PDF pages.',
      'Supports JPG, PNG, and modern WebP image formats with automatic page dimension fitting.',
      'You can drag to rearrange images, adjust margins, and export a consolidated PDF ready for official submission or archiving.'
    ],
    howTo: [
      'Select or drop one or more images (JPG, PNG, WebP) into the upload area.',
      'Drag and drop image cards to arrange the page sequence.',
      'Optionally delete or rotate individual photos.',
      'Click Convert to PDF to generate and download your new document.'
    ],
    specs: [
      { label: 'Supported Inputs', value: 'JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp)' },
      { label: 'Output Format', value: 'Standard PDF document (.pdf)' },
      { label: 'Page Layout', value: 'Automatic image aspect-ratio preservation' },
      { label: 'Privacy', value: 'Images are never uploaded; converted in local memory' }
    ],
    faqs: [
      {
        q: 'How do I convert images to a PDF for free?',
        a: 'Upload your images (JPG, PNG, or WebP) to LS PDF Image-to-PDF, reorder if needed, and click Convert. Your PDF downloads in seconds — no sign-up required.'
      },
      {
        q: 'Can I combine multiple images into one PDF?',
        a: 'Yes. You can upload multiple images and they will each become a page in the resulting PDF. You can drag to reorder them before converting.'
      },
      {
        q: 'What image formats are supported?',
        a: 'LS PDF Image to PDF supports JPG/JPEG, PNG, and WebP image formats.'
      }
    ],
    related: [
      { slug: 'pdf-to-image', title: 'PDF to Image', desc: 'Export PDF pages back into image files.' },
      { slug: 'merge', title: 'Merge PDF', desc: 'Combine your newly created PDF with other documents.' },
      { slug: 'compress', title: 'Compress PDF', desc: 'Reduce the final PDF file size.' }
    ]
  },

  'extract-images': {
    slug: 'extract-images',
    title: 'Extract Images',
    h1: 'Extract Images from PDF Online Free',
    summary: 'Pull out all original photos and embedded graphics from any PDF document in their native format and quality.',
    whatItDoes: [
      'Unlike taking screenshots, LS PDF Extract Images inspects internal PDF XObject streams to isolate original embedded image files.',
      'Extracted images retain their original resolution, color profile, and encoding without added artifacts or compression loss.',
      'Download discovered photos individually or save every extracted graphic in a convenient ZIP archive.'
    ],
    howTo: [
      'Upload your PDF document containing embedded images.',
      'Inspect the gallery of detected graphics and photos.',
      'Click individual images to save them one by one, or click Download All (ZIP) to export the full collection.'
    ],
    specs: [
      { label: 'Extraction Method', value: 'Direct PDF XObject stream extraction' },
      { label: 'Quality Retention', value: '100% native quality (no re-compression)' },
      { label: 'Output Package', value: 'Individual image files or consolidated ZIP archive' },
      { label: 'Privacy', value: 'Operates entirely within client browser memory' }
    ],
    faqs: [
      {
        q: 'How do I extract images from a PDF for free?',
        a: 'Upload your PDF to LS PDF Extract Images, and all embedded images will be detected and listed. Download them individually or all at once as a ZIP file.'
      },
      {
        q: 'Are the extracted images in their original quality?',
        a: 'Yes. LS PDF extracts images as they are embedded in the PDF, preserving their original resolution and quality.'
      }
    ],
    related: [
      { slug: 'pdf-to-image', title: 'PDF to Image', desc: 'Render complete pages as images.' },
      { slug: 'image-to-pdf', title: 'Image to PDF', desc: 'Combine extracted images into a new PDF.' },
      { slug: 'pdf-to-text', title: 'PDF to Text', desc: 'Extract plain text and OCR from documents.' }
    ]
  },

  'pdf-to-text': {
    slug: 'pdf-to-text',
    title: 'PDF to Text',
    h1: 'PDF to Text Online Free',
    summary: 'Extract readable plain text from PDF documents using fast native stream extraction or client-side Tesseract.js OCR for scanned pages.',
    whatItDoes: [
      'LS PDF PDF to Text provides two distinct text extraction pipelines depending on your document type.',
      'For standard digital PDFs: Fast native extraction parses embedded font maps and character streams directly via PDF.js, downloading instant plain text (.txt).',
      'For scanned documents and paper photos: In-browser Optical Character Recognition (OCR) powered by Tesseract.js WebAssembly analyzes the page images and extracts text without sending data to third-party cloud APIs.'
    ],
    howTo: [
      'Upload your PDF document into the text extractor.',
      'Choose Native Text for standard digital PDFs or OCR for scanned documents.',
      'Review the extracted text preview directly in your browser.',
      'Click Download .TXT or Copy to Clipboard to use your extracted content.'
    ],
    specs: [
      { label: 'Extraction Engines', value: 'PDF.js native text parser + Tesseract.js WebAssembly OCR' },
      { label: 'OCR Language', value: 'English (Tesseract.js eng traineddata by default)' },
      { label: 'Output Format', value: 'Plain text file (.txt) and instant clipboard copy' },
      { label: 'OCR Processing', value: 'Runs 100% locally in browser memory via WebAssembly' },
      { label: 'Privacy', value: 'Zero cloud OCR; documents never leave your device' }
    ],
    faqs: [
      {
        q: 'How do I extract text from a PDF for free?',
        a: 'Upload your PDF to LS PDF PDF-to-Text, and the text content will be extracted. For scanned PDFs, enable OCR mode to recognize text from images.'
      },
      {
        q: 'Can LS PDF extract text from scanned PDFs?',
        a: 'Yes. LS PDF uses Tesseract.js running locally in your browser to recognize text from scanned or image-based PDFs using English traineddata. OCR accuracy depends on scan resolution, contrast, and font clarity.'
      },
      {
        q: 'Is OCR processing private?',
        a: 'Yes. The Tesseract.js OCR engine runs locally in your browser using WebAssembly. No image data is sent to any server.'
      }
    ],
    related: [
      { slug: 'extract-images', title: 'Extract Images', desc: 'Extract graphics and photos from documents.' },
      { slug: 'metadata', title: 'Edit Metadata', desc: 'Inspect document properties and author info.' },
      { slug: 'split', title: 'Split PDF', desc: 'Extract specific page ranges before converting.' }
    ]
  },

  repair: {
    slug: 'repair',
    title: 'Repair PDF',
    h1: 'Repair Corrupted PDF Online Free',
    summary: 'Attempt to recover readable pages and elements from unreadable or damaged PDF files using fault-tolerant in-browser parsing.',
    whatItDoes: [
      'LS PDF Repair attempts to open damaged, incomplete, or unreadable PDF files using fault-tolerant parser settings that ignore invalid objects.',
      'If readable document elements can be accessed, the engine exports them into a clean, newly generated PDF file.',
      'Important Limitation: Recovery is strictly best-effort. If core structural data or underlying file bytes are permanently destroyed or missing, complete recovery is not possible.'
    ],
    howTo: [
      'Upload your damaged or unreadable PDF document.',
      'Click Attempt Repair to evaluate readable document data.',
      'Review the recovery status reported by the repair engine.',
      'Download your salvaged PDF file if recovery succeeded.'
    ],
    specs: [
      { label: 'Recovery Strategy', value: 'Fault-tolerant lenient object parsing' },
      { label: 'Engine', value: 'pdf-lib with error-tolerant document loading' },
      { label: 'Limitation', value: 'Best-effort recovery; cannot restore destroyed byte data' },
      { label: 'Privacy', value: 'All salvage operations execute 100% locally in browser memory' }
    ],
    faqs: [
      {
        q: 'How do I fix a corrupted PDF file?',
        a: 'Upload your damaged PDF to LS PDF Repair and click Attempt Repair. The tool attempts to salvage accessible objects and export a readable PDF file.'
      },
      {
        q: 'Can LS PDF fix all types of PDF corruption?',
        a: 'No. The tool uses best-effort parsing to salvage damaged files, but severely corrupted or zero-byte files cannot be recovered if fundamental document data is lost.'
      }
    ],
    related: [
      { slug: 'compress', title: 'Compress PDF', desc: 'Optimize recovered documents.' },
      { slug: 'metadata', title: 'Edit Metadata', desc: 'Fix or rebuild missing document properties.' },
      { slug: 'split', title: 'Split PDF', desc: 'Extract undamaged pages from recovered files.' }
    ]
  }
}
