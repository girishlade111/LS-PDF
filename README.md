# LS PDF

> **Stop uploading your privacy.** A fully client-side PDF toolkit — 17 tools, zero servers, absolute privacy.

![GitHub License](https://img.shields.io/github/license/girishlade111/LS-PDF)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)
![Android](https://img.shields.io/badge/platform-Android-brightgreen)
![PWA](https://img.shields.io/badge/PWA-ready-blueviolet)

---

## Use Cases

| Scenario | Why LS PDF |
|----------|------------|
| **Confidential documents** | NDAs, contracts, legal filings — never leave your device |
| **Sensitive personal data** | Bank statements, medical records, tax forms |
| **Air-gapped / offline environments** | No internet required after initial load (PWA) |
| **Quick casual edits** | Merge, split, rotate, compress without installing desktop software |
| **Mobile document processing** | Full Android app with "Open With" support |
| **Batch image conversion** | Photos of documents → JPG/PNG to PDF, or PDF to images |
| **Document forensics** | Extract embedded images, repair corrupted files, inspect metadata |
| **Compliance workflows** | Your documents never touch a third-party server — audit-friendly |

---

## Features — 17 Tools

### Edit
| Tool | Description |
|------|-------------|
| **Merge PDF** | Combine multiple PDFs with drag-and-drop reordering & per-file rotation |
| **Split PDF** | Visually select pages/ranges — export as single PDF or individual pages via ZIP |
| **Rotate PDF** | Rotate individual pages with live preview thumbnails |
| **Rearrange PDF** | Drag-and-drop page reordering powered by @dnd-kit |
| **Page Numbers** | Add page numbers with customizable format, position, offset |
| **Watermark** | Add custom text watermark (opacity, rotation, color, font size) |
| **Signature** | Import signature image — drag to position & resize on the page |

### Convert
| Tool | Description |
|------|-------------|
| **PDF to Image** | Export pages as JPG/PNG in a ZIP archive |
| **Image to PDF** | Convert JPG, PNG, WebP images into a single PDF |
| **Extract Images** | Extract all embedded images from a PDF into a ZIP |
| **PDF to Text** | Extract text (native extraction + OCR via Tesseract.js) |

### Secure
| Tool | Description |
|------|-------------|
| **Protect PDF** | Encrypt PDF with a password |
| **Unlock PDF** | Remove password from protected PDFs |
| **Metadata** | View & edit document properties (title, author, subject, keywords) |

### Optimize
| Tool | Description |
|------|-------------|
| **Compress PDF** | Reduce file size with interactive before/after quality slider |
| **Grayscale** | Convert entire PDF to black & white |
| **Repair PDF** | Attempt to rebuild corrupted or malformed PDF files |

### Platform Features
- **Quick Drop / File Pipeline** — Drag a PDF anywhere onto the app for instant preview, then pick a tool
- **Android "Open With" / Share Intent** — Import PDFs directly from other apps (Files, Gmail, Drive, etc.)
- **Activity History** — IndexedDB session history with re-download links
- **Auto-Wipe** — Auto-clear workspace after configurable inactivity timeout
- **Auto-Download** — Automatically save processed files to downloads
- **Workspace Persistence** — In-progress work survives page refreshes via IndexedDB snapshots
- **Dark / Light / System Theme** — Smooth CSS transitions, persisted to localStorage
- **Haptic Feedback** — Vibration on action confirmations (Android)
- **Privacy Vault** — Zero-server, no telemetry, no cookies, no analytics

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | React 18 + TypeScript 5 |
| **Bundler** | Vite 8 (esbuild minify, manual chunking for PDF libraries) |
| **Styling** | Tailwind CSS 3 + PostCSS |
| **Routing** | react-router-dom 7 (HashRouter) |
| **Icons** | Lucide React |
| **Drag & Drop** | @dnd-kit (core, sortable, utilities) |
| **PDF Engine** | pdf-lib + pdfjs-dist 5 (Mozilla PDF.js) |
| **Encryption** | @pdfsmaller/pdf-encrypt-lite |
| **OCR** | Tesseract.js 7 (excluded in F-Droid lite build) |
| **Archive** | JSZip |
| **Mobile Bridge** | Capacitor 8 (filesystem, haptics, share, app) |
| **Notifications** | Sonner (toast notifications) |
| **PWA** | vite-plugin-pwa (service worker, offline support) |
| **CI/CD** | GitHub Actions (Pages deploy + Android release signing) |

---

## Privacy

LS PDF is built on a **zero-server architecture**.

- **No uploads.** All processing runs in your browser (WebAssembly, Canvas 2D, Web Workers) or natively on Android.
- **No telemetry.** No analytics SDK, no crash reporter, no tracking pixels.
- **No cookies.** Zero cookies are set by the application.
- **No network requests.** The app never sends your documents over the network. The sole exception is loading the page itself (from GitHub Pages) and the optional Tesseract.js OCR worker (loaded from a CDN unless running the F-Droid build).

You can verify this yourself: open DevTools → Network tab. Process any document. You will see zero outbound requests.

---

## Data Retention

LS PDF stores data **only on your device** and only for convenience features you explicitly opt into:

| Data | Where | Lifespan | User Control |
|------|-------|----------|-------------|
| **Activity history** | IndexedDB (`LsPdfDB`) | Until cleared or hits configured limit (default: 10 entries) | Settings → Clear History; configurable history limit (10/25/50/∞) |
| **Workspace snapshots** | IndexedDB (`LsPdfWorkspace`) | Until tool completes or workspace is cleared | Automatically cleared on tool completion; Settings → Clear Workspace |
| **Theme preference** | localStorage | Persistent until changed | Settings → Theme selector |
| **Auto-wipe timer** | localStorage | Persistent until changed | Settings → Auto-Wipe |
| **Last seen timestamp** | localStorage | Persistent | Not user-facing; used only for wipe idle detection |
| **Processed files** | In-memory (blob URLs) | Session only — freed on page unload | N/A — automatic |

**No data is ever sent to any server.** Clearing your browser storage removes all LS PDF data from your device.

---

## Installation Guide

### Web (PWA)

No installation needed. Open in any modern browser:
- **Live site:** [https://girishlade111.github.io/LS-PDF](https://girishlade111.github.io/LS-PDF)
- **Install as PWA:** Click the install icon in your browser's address bar (Chrome / Edge / Samsung Internet)

### Android APK

Download the latest release from:
- **GitHub Releases:** [releases page](https://github.com/girishlade111/LS-PDF/releases)
- **F-Droid:** Coming soon (lite build without OCR)

#### Build Variants
- **Global** — Full build with OCR support
- **F-Droid Lite** — OCR excluded (smaller APK, no CDN dependency)

### Development Setup

```bash
# Prerequisites: Node.js >= 18, npm

# Clone
git clone https://github.com/girishlade111/LS-PDF.git
cd LS-PDF

# Install dependencies
npm install

# Start dev server (hot reload at http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

#### Android Build

```bash
npm ci
npm run build
npx cap sync android
```

Open `android/` in Android Studio, or build from CLI:

```bash
cd android
./gradlew assembleRelease
```

To build the F-Droid lite variant (no OCR):

```bash
set VITE_DISABLE_OCR=true && npm run build && npx cap sync android
```

---

## User Guide

### Quick Start

1. Open LS PDF (web app or Android app)
2. Drag & drop a PDF onto the page — or tap to browse files (on Android, use "Open With" from any app)
3. Select a tool from the dashboard
4. Process your document
5. Download the result

### Tool Workflows

| Tool | Steps |
|------|-------|
| **Merge** | Upload 2+ PDFs → drag to reorder → rotate individual files if needed → click Merge → download |
| **Split** | Upload a PDF → visually select pages or enter ranges (e.g. `1-3, 5, 7-9`) → choose output format (single PDF or individual pages via ZIP) → Split |
| **Compress** | Upload → drag the quality slider → preview before/after size → download compressed PDF |
| **Protect** | Upload → enter a password → download encrypted PDF |
| **Unlock** | Upload a password-protected PDF → enter the password → download unlocked PDF |
| **Rotate** | Upload → click individual pages to rotate CW/CCW → Apply |
| **Rearrange** | Upload → drag-and-drop page thumbnails into desired order → Apply |
| **Watermark** | Upload → enter watermark text → configure opacity, rotation, color, font → Apply |
| **Page Numbers** | Upload → choose position (bottom-left, bottom-center, bottom-right, etc.) → set format and starting number → Apply |
| **Metadata** | Upload → view/edit title, author, subject, keywords → Save |
| **Signature** | Upload → upload a signature image (PNG with transparent background recommended) → drag to position & resize → Apply |
| **PDF to Image** | Upload → choose format (JPG/PNG) → export — downloads a ZIP of all pages |
| **Image to PDF** | Upload one or more images → arrange order → Convert |
| **Extract Images** | Upload → Extract — downloads a ZIP of all embedded images |
| **PDF to Text** | Upload → extract text natively; toggle OCR for scanned documents → copy or download as `.txt` |
| **Grayscale** | Upload → convert to B&W → download |
| **Repair** | Upload a corrupted PDF → attempt repair → download fixed copy |

### Tips

- **Auto-Download:** Toggle on in Settings to skip the "Save" prompt.
- **Auto-Wipe:** Set a timer (30s / 60s / 5min) to auto-clear the workspace after inactivity.
- **Workspace Recovery:** If you accidentally refresh mid-operation, your files and settings are restored automatically.
- **Android Share Intent:** Open any PDF from Files, Gmail, WhatsApp, etc. → tap Share → choose LS PDF.

---

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root — routing, tools, theme, drag-drop
├── index.css                 # Tailwind, fonts, scrollbar, theme transitions
├── types.ts                  # TypeScript interfaces
├── components/
│   ├── Layout.tsx            # Header, footer, drag-drop overlay, history, mobile nav
│   ├── WebView.tsx           # Desktop dashboard
│   ├── AndroidView.tsx       # Android home screen
│   ├── AndroidToolsView.tsx  # Android tool catalog
│   ├── AndroidHistoryView.tsx# Android history
│   ├── PdfPreview.tsx        # Full-screen PDF viewer
│   ├── Settings.tsx          # Preferences (theme, auto-wipe, auto-download, history)
│   ├── About.tsx             # About & architecture
│   ├── PrivacyPolicy.tsx     # Privacy protocol
│   ├── tools/                # 17 tool components
│   │   ├── MergeTool.tsx
│   │   ├── SplitTool.tsx
│   │   ├── CompressTool.tsx
│   │   ├── ProtectTool.tsx
│   │   ├── UnlockTool.tsx
│   │   ├── RotateTool.tsx
│   │   ├── RearrangeTool.tsx
│   │   ├── WatermarkTool.tsx
│   │   ├── PageNumberTool.tsx
│   │   ├── MetadataTool.tsx
│   │   ├── SignatureTool.tsx
│   │   ├── PdfToImageTool.tsx
│   │   ├── ImageToPdfTool.tsx
│   │   ├── PdfToTextTool.tsx
│   │   ├── ExtractImagesTool.tsx
│   │   ├── GrayscaleTool.tsx
│   │   ├── RepairTool.tsx
│   │   └── shared/           # Shared tool utilities
│   └── ...
└── utils/
    ├── pdfHelpers.ts          # Core PDF operations (merge, split, rotate, etc.)
    ├── pdfWorker.ts           # Web Worker for heavy operations off the main thread
    ├── pipelineContext.tsx     # File buffer pipeline (React context)
    ├── recentActivity.ts      # IndexedDB activity history
    ├── workspacePersistence.ts# IndexedDB workspace save/restore
    ├── viewModeContext.tsx     # Web vs Android view mode switch
    ├── useObjectURL.ts        # Object URL management hook
    └── haptics.ts             # Capacitor haptic feedback
```

---

## Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Base path, build target, manual chunking for PDF libs |
| `capacitor.config.ts` | App ID, name, web directory |
| `tailwind.config.js` | Dark mode, custom font, animations |
| `.env` / env vars | `VITE_BASE`, `VITE_DISABLE_OCR` |

---

## Deployment

- **GitHub Pages:** Push to `main` → auto-deploys via `.github/workflows/deploy.yml`
- **Android APK:** Push to `main` → builds & signs both variants via `.github/workflows/android-release.yml`

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build (TypeScript check + Vite build) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all source files |

---

## License

**GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**

See [LICENSE](./LICENSE) for details.
