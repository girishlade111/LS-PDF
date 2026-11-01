import { Link } from 'react-router-dom'
import { HelpCircle, ArrowRight, ShieldCheck, Wrench, ChevronDown } from 'lucide-react'
import { TOOL_GUIDES, ToolGuideData } from '../../../utils/toolGuideData'

interface ToolDocumentationProps {
  toolSlug: string
}

function renderParagraphWithLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\(\/?[-a-zA-Z0-9_]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\((\/[-a-zA-Z0-9_]+)\)$/);
    if (match) {
      return (
        <Link
          key={i}
          to={match[2]}
          className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 underline decoration-rose-500/30 hover:decoration-rose-500 font-semibold transition-colors"
        >
          {match[1]}
        </Link>
      );
    }
    return part;
  });
}

export default function ToolDocumentation({ toolSlug }: ToolDocumentationProps) {
  const guide: ToolGuideData | undefined = TOOL_GUIDES[toolSlug]

  if (!guide) return null

  return (
    <section className="mt-16 pt-12 border-t border-gray-100 dark:border-white/5 space-y-12 text-left" aria-label={`${guide.title} Guide and Documentation`}>
      {/* Overview & Key Capabilities */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 dark:border-rose-900/30">
          <ShieldCheck size={14} /> Document Guide
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          About {guide.title}
        </h2>
        <div className="space-y-3 text-sm md:text-base text-gray-600 dark:text-zinc-400 leading-relaxed font-normal">
          {guide.whatItDoes.map((paragraph, idx) => (
            <p key={idx}>{renderParagraphWithLinks(paragraph)}</p>
          ))}
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center font-black">
            <Wrench size={20} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            How to Use {guide.title}
          </h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
          {guide.howTo.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100/80 dark:border-white/5">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="text-xs md:text-sm text-gray-700 dark:text-zinc-300 font-medium leading-relaxed">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Technical Specifications & Disclosures */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Technical Specifications & Security
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {guide.specs.map((spec, idx) => (
            <div key={idx} className="p-4 bg-white dark:bg-zinc-900/60 rounded-2xl border border-gray-100 dark:border-white/5">
              <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-1">
                {spec.label}
              </dt>
              <dd className="text-xs md:text-sm font-bold text-gray-900 dark:text-white">
                {spec.value}
              </dd>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (Matches JSON-LD Schema) */}
      {guide.faqs && guide.faqs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-rose-500" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {guide.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-5 bg-white dark:bg-zinc-900/40 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-rose-500/30 transition-all open:ring-1 open:ring-rose-500/20"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-sm md:text-base text-gray-900 dark:text-white select-none">
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-2" />
                </summary>
                <p className="mt-3 text-xs md:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-normal pt-2 border-t border-gray-50 dark:border-white/5">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools with Semantic Hyperlinks */}
      {guide.related && guide.related.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Related PDF Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guide.related.map((rel) => (
              <Link
                key={rel.slug}
                to={`/${rel.slug}`}
                className="group p-5 bg-white dark:bg-zinc-900/40 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-rose-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors mb-1">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">
                    {rel.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-rose-500 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
