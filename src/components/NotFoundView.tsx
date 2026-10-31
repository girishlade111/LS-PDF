import { Link } from 'react-router-dom'
import { FileQuestion, Home, Layers, Scissors, Zap, Lock, ArrowRight } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function NotFoundView() {
  const popularTools = [
    { title: 'Merge PDF', path: '/merge', desc: 'Combine multiple PDF files', icon: Layers, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { title: 'Split PDF', path: '/split', desc: 'Extract pages and ranges', icon: Scissors, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Compress PDF', path: '/compress', desc: 'Reduce file size efficiently', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { title: 'Protect PDF', path: '/protect', desc: 'Encrypt with password', icon: Lock, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ]

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <Helmet>
        <title>404: Page Not Found — LS PDF</title>
        <meta name="description" content="The page you requested could not be found on LS PDF. Explore our 17 free, private, client-side PDF tools." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
        <FileQuestion size={40} strokeWidth={2} />
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
        404 &mdash; Page Not Found <span className="text-rose-500">.</span>
      </h1>
      
      <p className="max-w-md text-sm md:text-base text-gray-500 dark:text-zinc-400 font-medium leading-relaxed mb-10">
        The URL you requested does not exist, was moved, or had an incorrect path. All PDF tools are available below or on the homepage.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <Link 
          to="/"
          className="px-6 py-3.5 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center gap-2 active:scale-95"
        >
          <Home size={16} />
          Return to Dashboard
        </Link>
        <Link 
          to="/about"
          className="px-6 py-3.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
        >
          About LS PDF
        </Link>
      </div>

      {/* Popular Tools Directory */}
      <div className="w-full max-w-3xl text-left border-t border-gray-100 dark:border-white/5 pt-12">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500 mb-6 text-center">
          Popular PDF Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularTools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.path}
              className="p-4 bg-white dark:bg-zinc-900/40 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-rose-500/50 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${tool.bg} ${tool.color}`}>
                  <tool.icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">{tool.desc}</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
