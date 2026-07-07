/**
 * LS PDF — useSEO Hook
 * Injects per-page SEO metadata using react-helmet-async.
 * Handles: title, description, keywords, canonical, OG, Twitter cards, and JSON-LD.
 */

import { Helmet } from 'react-helmet-async'
import type { ToolSEOData } from './seoData'
import { SITE_NAME, SITE_URL } from './seoData'

const OG_IMAGE = `${SITE_URL}/icons/icon-512.webp`

const DEFAULT_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'

function generateBreadcrumbJsonLd(canonical: string): object {
  const url = new URL(canonical)
  const parts = url.pathname.split('/').filter(Boolean)
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
  }

  const itemListElement = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${url.origin}/` },
  ]

  if (parts.length > 0) {
    parts.forEach((part, i) => {
      const name = nameMap[part] || part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      itemListElement.push({
        '@type': 'ListItem',
        position: i + 2,
        name,
        item: `${url.origin}/${parts.slice(0, i + 1).join('/')}`,
      })
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

interface UseSEOProps extends ToolSEOData {
  ogImage?: string
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  jsonLd,
  ogImage = OG_IMAGE,
  robots,
}: UseSEOProps) {
  const resolvedOgTitle = ogTitle ?? title
  const resolvedOgDesc = ogDescription ?? description
  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : [jsonLd]

  const breadcrumb = generateBreadcrumbJsonLd(canonical)

  const allJsonLd = [...jsonLdArray, breadcrumb]

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={robots || DEFAULT_ROBOTS} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={resolvedOgTitle} />
      <meta name="twitter:description" content={resolvedOgDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {allJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  )
}
