import { track } from '@vercel/analytics'

export type AnalyticsEventName =
  | 'tool_open'
  | 'file_selected'
  | 'processing_started'
  | 'processing_success'
  | 'processing_failure'
  | 'download_completed'

export interface EventData {
  tool?: string
  pageCount?: number
  fileSizeCategory?: string // Anonymous coarse size buckets only: '<1MB', '1-5MB', '5-20MB', '>20MB'
  outputFormat?: string
  durationMs?: number
  errorCategory?: string // Sanitized generic category only, NEVER file info or stack traces
}

/**
 * Privacy-Safe Event Tracking Abstraction for LS PDF.
 *
 * STRICT PRIVACY CONTRACT:
 * - NEVER sends PDF contents
 * - NEVER sends document text
 * - NEVER sends filenames or file paths
 * - NEVER sends passwords or credentials
 * - NEVER sends user metadata or thumbnails
 * - Only sends anonymous, aggregated operational metrics (tool name, coarse duration, coarse size bucket).
 */
export const trackEvent = (name: AnalyticsEventName, data?: EventData) => {
  try {
    if (typeof window === 'undefined') return

    const sanitizedData: Record<string, string | number | boolean> = {}
    if (data?.tool) sanitizedData.tool = data.tool
    if (typeof data?.pageCount === 'number' && Number.isFinite(data.pageCount)) {
      sanitizedData.pageCount = Math.min(Math.max(1, Math.round(data.pageCount)), 1000)
    }
    if (data?.fileSizeCategory) sanitizedData.fileSizeCategory = data.fileSizeCategory
    if (data?.outputFormat) sanitizedData.outputFormat = data.outputFormat
    if (typeof data?.durationMs === 'number' && Number.isFinite(data.durationMs)) {
      sanitizedData.durationMs = Math.round(data.durationMs)
    }
    if (data?.errorCategory) {
      sanitizedData.errorCategory = data.errorCategory.slice(0, 50)
    }

    track(name, sanitizedData)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.debug('[Analytics] Event tracking suppressed or failed:', name, err)
    }
  }
}

/**
 * Helper to get privacy-safe coarse file size categories without exposing exact byte counts.
 */
export const getCoarseSizeCategory = (bytes: number): string => {
  if (bytes < 1024 * 1024) return '<1MB'
  if (bytes < 5 * 1024 * 1024) return '1-5MB'
  if (bytes < 20 * 1024 * 1024) return '5-20MB'
  return '>20MB'
}
