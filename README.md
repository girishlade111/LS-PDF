# LS PDF — PaperKnife

> **Stop Uploading Your Privacy.** A privacy-first, fully client-side Swiss Army Knife for PDFs.

![GitHub License](https://img.shields.io/github/license/girishlade111/LS-PDF)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)
![Android](https://img.shields.io/badge/platform-Android-brightgreen)
![PWA](https://img.shields.io/badge/PWA-ready-blueviolet)

---

## Overview

**LS PDF (PaperKnife)** is a privacy-first PDF utility with **17+ tools** — all running **entirely in your browser or on your Android device**. Zero files are ever uploaded to any server. Every operation happens locally in your device memory.

Available as:
- 🌐 **Web app** (hosted on GitHub Pages)
- 📱 **Android APK** — Global (with OCR) & F-Droid Lite (no OCR)

---

## Features — 17 Tools at Your Fingertips

### Edit
| Tool | Description |
|------|-------------|
| **Merge PDF** | Combine multiple PDFs with drag-and-drop reordering & per-file rotation |
| **Split PDF** | Visually select pages/ranges to extract — single PDF or individual pages via ZIP |
| **Rotate PDF** | Rotate individual pages with live preview |
| **Rearrange PDF** | Drag-and-drop page reordering powered by dnd-kit |
| **Page Numbers** | Add page numbers with customizable format & position |
| **Watermark** | Add custom text watermark (opacity, rotation, color, font size) |
| **Signature** | Add an electronic signature image — drag to position & resize |

### Convert
| Tool | Description |
|------|-------------|
| **PDF to Image** | Export pages as JPG/PNG in a ZIP archive |
| **Image to PDF** | Convert JPG, PNG, WebP images into a single PDF |
| **Extract Images** | Pull out all embedded images into a ZIP |
| **PDF to Text** | Extract text (native extraction + OCR via Tesseract.js) |

### Secure
| Tool | Description |
|------|-------------|
| **Protect PDF** | Encrypt PDF with password |
| **Unlock PDF** | Remove password from protected PDFs |
| **Metadata** | View & edit document properties (title, author, subject, keywords) |

### Optimize
| Tool | Description |
|------|-------------|
| **Compress PDF** | Reduce file size with interactive before/after quality slider |
| **Grayscale** | Convert entire PDF to black & white |
| **Repair PDF** | Attempt to rebuild corrupted PDF files |

### Platform Features
- **Quick Drop / File Pipeline** — Drag a PDF onto the app for instant preview, then pick a tool
- **Android "Open With" / Share Intent** — Import PDFs directly from other apps
- **Activity History** — IndexedDB session history with redownload links
- **Auto-Wipe** — Auto-clear workspace after configurable inactivity timeout
- **Auto-Download** — Automatically save processed files
- **Dark / Light / System Theme** — Smooth transitions, persisted to local storage
- **Haptic Feedback** (Android)
- **Workspace Persistence** — In-progress work survives page refreshes (IndexedDB)
- **Privacy Vault** — Zero-server, no telemetry, no cookies, no analytics

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 + TypeScript |
| **Bundler** | Vite 5 |
| **Styling** | Tailwind CSS 3 + PostCSS |
| **Routing** | react-router-dom (HashRouter) |
| **Icons** | Lucide React |
| **Drag & Drop** | @dnd-kit (core, sortable, utilities) |
| **PDF Engine** | pdf-lib + pdfjs-dist (Mozilla PDF.js) |
| **Encryption** | @pdfsmaller/pdf-encrypt-lite |
| **OCR** | Tesseract.js (excluded in F-Droid build) |
| **Mobile Bridge** | Capacitor 8 (filesystem, haptics, share, app) |
| **CI/CD** | GitHub Actions (Pages deploy + Android release) |

---

## Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm**

### Web Development
```bash
# Clone
git clone https://github.com/girishlade111/LS-PDF.git
cd LS-PDF

# Install
npm install

# Dev server (hot reload at http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Android Build
```bash
npm ci
npm run build
npx cap sync android
```
Then open `android/` in Android Studio or run:
```bash
cd android
./gradlew assembleRelease
```

### Build Variants
- **Global** (with OCR) — default build
- **F-Droid Lite** (no OCR) — set `VITE_DISABLE_OCR=true` before building:
  ```bash
  set VITE_DISABLE_OCR=true && npm run build
  ```

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
│   ├── Settings.tsx          # Preferences
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
│   │   └── shared/           # Shared tool components
│   └── ...
└── utils/
    ├── pdfHelpers.ts          # Core PDF utilities
    ├── pdfWorker.ts           # Web Worker for heavy operations
    ├── pipelineContext.tsx     # File buffer pipeline context
    ├── recentActivity.ts      # IndexedDB history
    ├── workspacePersistence.ts# IndexedDB workspace save/restore
    ├── viewModeContext.tsx    # Web vs Android view mode
    ├── useObjectURL.ts        # Object URL hook
    └── haptics.ts             # Capacitor haptic feedback
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Base path, build target, manual chunking |
| `capacitor.config.ts` | App ID, name, web directory |
| `tailwind.config.js` | Dark mode, custom font, animations |
| `.env` / env vars | `VITE_BASE`, `VITE_DISABLE_OCR` |

---

## Deployment

- **GitHub Pages**: Push to `main` → auto-deploys via `.github/workflows/deploy.yml`
- **Android APK**: Push to `main` → builds & signs both variants via `.github/workflows/android-release.yml`

---

## License

**GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**

See [LICENSE](./LICENSE) for details.

---

## Privacy

**No servers. No uploads. No tracking. No cookies. No analytics.**

All processing is done client-side using WebAssembly, Canvas 2D, and Web Workers. Your documents never leave your device.
