import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { 
  Download as DownloadIcon, 
  Moon as MoonIcon, 
  Sun as SunIcon, 
  History as HistoryIcon, 
  Upload as UploadIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronDown as ChevronDownIcon,
  Plus as PlusIcon, 
  Trash2 as Trash2Icon, 
  Home as HomeIcon, 
  Info as InfoIcon, 
  ArrowLeft as ArrowLeftIcon,
  LayoutGrid as LayoutGridIcon, 
  Settings as SettingsIcon,
  Github as GHIcon,
  Download
} from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { Theme, Tool, ToolCategory, ViewMode } from '../types'
import { LsPdfLogo } from './Logo'
import { ActivityEntry, getRecentActivity, clearActivity } from '../utils/recentActivity'
import { hapticImpact } from '../utils/haptics'

interface LayoutProps {
  children: React.ReactNode
  theme: Theme
  toggleTheme: () => void
  tools: Tool[]
  onFileDrop?: (files: FileList) => void
  viewMode: ViewMode
}

const categoryColors: Record<ToolCategory, { bg: string, text: string, hover: string, iconBg: string }> = {
  Edit: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-500', hover: 'hover:bg-rose-50 dark:hover:bg-rose-900/10', iconBg: 'bg-rose-100 dark:bg-rose-900/30' },
  Secure: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-500', hover: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/10', iconBg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  Convert: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-500', hover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/10', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  Optimize: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-500', hover: 'hover:bg-amber-50 dark:hover:bg-amber-900/10', iconBg: 'bg-amber-100 dark:bg-amber-900/30' }
}

export default function Layout({ children, theme, toggleTheme, tools, onFileDrop, viewMode }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDragging, setIsDragging] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isNative = Capacitor.isNativePlatform()
  const showMobileNav = isNative || viewMode === 'android'
  
  const isMobileBrowser = !isNative && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  useEffect(() => {
    if (showHistory) {
      getRecentActivity().then(setActivity)
    }
  }, [showHistory])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // Disable global drop on mobile to prevent accidental triggers/bugs
    if (Capacitor.isNativePlatform()) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (onFileDrop) setIsDragging(true)
    }
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDragging(false)
      }
    }
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (onFileDrop && e.dataTransfer?.files) {
        onFileDrop(e.dataTransfer.files)
      }
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)
    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
    }
  }, [onFileDrop])

  const activeTool = tools.find(t => t.path === location.pathname)

  const isHome = location.pathname === '/'

  const isMainView = isHome || 
    location.pathname.endsWith('/android-tools') || 
    location.pathname.endsWith('/android-history') || 
    location.pathname.endsWith('/settings')

  const shouldShowNav = showMobileNav && isMainView && !activeTool

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 transition-colors duration-300`}>
      
      {isDragging && (
        <div className="fixed inset-0 z-[200] bg-rose-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] shadow-2xl border-4 border-dashed border-rose-500 animate-in zoom-in duration-300">
            <UploadIcon size={64} className="text-rose-500 animate-bounce" />
            <p className="mt-4 font-black uppercase tracking-widest text-rose-500 text-center text-sm">Drop PDF to start</p>
          </div>
        </div>
      )}

      {/* Web Header */}
      {!showMobileNav && (
        <header className="flex items-center justify-between px-4 md:px-8 h-16 md:h-20 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-[100]">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            {!isHome && (
              <button 
                onClick={() => navigate('/')} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-xl transition-colors text-gray-500 hover:text-rose-500 shrink-0"
                aria-label="Back to Home"
              >
                <ArrowLeftIcon size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <LsPdfLogo size={Capacitor.isNativePlatform() ? 24 : 28} iconColor="#F43F5E" />
              <span className="font-black tracking-tighter text-lg md:text-xl dark:text-white hidden xs:block">LS PDF</span>
            </Link>
            <div className="h-6 w-[1px] bg-gray-200 dark:bg-zinc-800 mx-1 md:mx-2 shrink-0" />
            <div className="relative min-w-0" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className={`flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-xl transition-all font-black text-[10px] md:text-sm uppercase tracking-widest min-w-0 ${isDropdownOpen ? 'bg-rose-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-900'}`}
                aria-label="All Tools Directory"
                aria-expanded={isDropdownOpen}
              >
                <span className="truncate">{isHome ? 'All Tools' : activeTool?.title || 'Tool'}</span>
                <ChevronDownIcon size={14} className={`transition-transform duration-300 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 md:w-80 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2rem] shadow-2xl py-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 max-h-[80vh] overflow-y-auto scrollbar-hide z-50">
                  {Object.entries(tools.filter(t => t.implemented).reduce((acc, tool) => { if (!acc[tool.category]) acc[tool.category] = []; acc[tool.category].push(tool); return acc }, {} as Record<string, Tool[]>)).map(([category, categoryTools]) => {
                    const colors = categoryColors[category as ToolCategory]
                    return (
                      <div key={category} className="mb-4">
                        <div className="px-6 py-2"><span className={`text-[10px] font-black uppercase tracking-[0.2em] ${colors.text} opacity-60`}>{category}</span></div>
                        <div className="grid grid-cols-1 gap-1 px-2">
                          {categoryTools.map((tool, i) => {
                            const Icon = tool.icon; const isActive = activeTool?.title === tool.title && !isHome
                            return (
                              <Link 
                                key={i} 
                                to={tool.path || '/'} 
                                onClick={() => setIsDropdownOpen(false)} 
                                className={`flex items-center gap-4 p-3 rounded-2xl transition-all text-left group ${isActive ? `${colors.bg} ${colors.text}` : `hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400`}`}
                              >
                                <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white dark:bg-zinc-800' : `${colors.iconBg} ${colors.text} opacity-70 group-hover:opacity-100`}`}><Icon size={18} /></div>
                                <div className="flex-1 min-w-0"><p className="text-xs font-black uppercase tracking-tight">{tool.title}</p><p className="text-[10px] opacity-60 truncate">{tool.desc}</p></div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-3 shrink-0">
            {isMobileBrowser && (
              <a 
                href="https://github.com/girishlade111/LS-PDF/releases/latest" 
                target="_blank"
                rel="noreferrer"
                className="hidden xs:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                <Download size={14} strokeWidth={3} />
                Get APK
              </a>
            )}
            <Link to="/about" className={`p-2 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${location.pathname.includes('about') ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-900'}`}>
              <InfoIcon size={18} />
              <span className="hidden sm:block">About</span>
            </Link>
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            </button>
            <button 
              onClick={() => setShowHistory(true)} 
              className={`p-2 transition-colors relative ${showHistory ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
              aria-label="View Activity History"
            >
              <HistoryIcon size={20} />
              {activity.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-black" />}
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 min-w-0 ${shouldShowNav ? 'pb-32' : ''}`}>
        {children}
      </main>

      {/* Web Footer - Modern Categorized Tool Directory */}
      {!showMobileNav && (
        <footer className="border-t border-gray-100 dark:border-white/5 mt-20 bg-white dark:bg-black relative z-10 text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
            
            <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-12">
              
              {/* Brand Column (Span 4) */}
              <div className="col-span-2 md:col-span-4 space-y-4">
                <Link to="/" className="flex items-center gap-2.5 text-gray-900 dark:text-white group w-fit">
                  <LsPdfLogo size={24} iconColor="#F43F5E" />
                  <span className="font-black tracking-tight text-xl group-hover:text-rose-500 transition-colors">LS PDF</span>
                </Link>
                <p className="text-gray-500 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
                  The privacy-first PDF toolkit. 17 client-side tools running 100% on your device with zero server uploads. Open source, cookieless, and free forever.
                </p>
                <div className="flex items-center gap-2 pt-2">
                   <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-wide border border-emerald-100 dark:border-emerald-900/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Client Engine Active
                   </div>
                   <a 
                    href="https://github.com/girishlade111/LS-PDF" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-gray-50 dark:bg-zinc-900 rounded-xl hover:bg-rose-500 hover:text-white transition-all text-gray-500 dark:text-zinc-400"
                    aria-label="GitHub Repository"
                   >
                     <GHIcon size={14} />
                   </a>
                </div>
              </div>

              {/* Edit Tools (Span 2) */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-rose-500">Edit</h4>
                <ul className="space-y-2 text-xs list-none p-0">
                  <li><Link to="/merge" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Merge PDF</Link></li>
                  <li><Link to="/split" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Split PDF</Link></li>
                  <li><Link to="/rotate-pdf" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Rotate PDF</Link></li>
                  <li><Link to="/rearrange-pdf" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Rearrange PDF</Link></li>
                  <li><Link to="/page-numbers" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Page Numbers</Link></li>
                  <li><Link to="/watermark" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Watermark</Link></li>
                  <li><Link to="/signature" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Signature</Link></li>
                </ul>
              </div>

              {/* Convert Tools (Span 2) */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-emerald-500">Convert</h4>
                <ul className="space-y-2 text-xs list-none p-0">
                  <li><Link to="/pdf-to-image" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">PDF to Image</Link></li>
                  <li><Link to="/image-to-pdf" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Image to PDF</Link></li>
                  <li><Link to="/extract-images" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Extract Images</Link></li>
                  <li><Link to="/pdf-to-text" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">PDF to Text</Link></li>
                </ul>
              </div>

              {/* Secure & Optimize (Span 2) */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-indigo-500">Security & Optimize</h4>
                <ul className="space-y-2 text-xs list-none p-0">
                  <li><Link to="/protect" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Protect PDF</Link></li>
                  <li><Link to="/unlock" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Unlock PDF</Link></li>
                  <li><Link to="/metadata" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Edit Metadata</Link></li>
                  <li><Link to="/compress" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Compress PDF</Link></li>
                  <li><Link to="/grayscale" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Grayscale</Link></li>
                  <li><Link to="/repair" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Repair PDF</Link></li>
                </ul>
              </div>

              {/* Protocol Column (Span 2) */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <h4 className="font-black text-[10px] uppercase tracking-widest text-gray-900 dark:text-white">Protocol</h4>
                <ul className="space-y-2 text-xs list-none p-0">
                  <li><Link to="/about" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">About LS PDF</Link></li>
                  <li><Link to="/privacy" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Privacy Spec</Link></li>
                  <li><Link to="/settings" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">Settings</Link></li>
                  <li><a href="https://github.com/girishlade111/LS-PDF/blob/main/LICENSE" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-zinc-400 hover:text-rose-500 transition-colors">License (AGPL-3.0)</a></li>
                </ul>
              </div>

            </div>
            
            <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-zinc-500 font-medium">
              <p>© 2026 LS PDF Project. Cookieless & 100% on-device document processing.</p>
              <p className="text-[11px] text-gray-400">Crafted by Girish Lade — LadeStack</p>
            </div>
          </div>
        </footer>
      )}

      {/* Titan Bottom Navigation (Solid, Grounded) */}
      {shouldShowNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800 flex items-end justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <Link 
            to="/"
            className={`flex flex-col items-center gap-1.5 flex-1 transition-all no-underline ${location.pathname === '/' ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}
          >
            <HomeIcon size={24} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Home</span>
          </Link>

          <Link 
            to="/android-tools"
            className={`flex flex-col items-center gap-1.5 flex-1 transition-all no-underline ${location.pathname === '/android-tools' ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}
          >
            <LayoutGridIcon size={24} strokeWidth={location.pathname === '/android-tools' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Tools</span>
          </Link>

          {/* Floating Action Button - Lifted */}
          <div className="relative -top-8">
             <button 
               onClick={() => {
                 hapticImpact()
                 const input = document.createElement('input')
                 input.type = 'file'
                 input.accept = '.pdf'
                 input.onchange = (e) => {
                   const file = (e.target as HTMLInputElement).files?.[0]
                   if (file) onFileDrop?.([file] as any)
                 }
                 input.click()
               }}
               className="w-14 h-14 bg-rose-500 text-white rounded-2xl shadow-xl shadow-rose-500/40 flex items-center justify-center active:scale-90 transition-transform ring-4 ring-white dark:ring-black"
               aria-label="Upload File"
             >
               <PlusIcon size={32} strokeWidth={3} />
             </button>
          </div>
          
          <Link 
            to="/android-history"
            className={`flex flex-col items-center gap-1.5 flex-1 transition-all no-underline ${location.pathname === '/android-history' ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}
          >
            <HistoryIcon size={24} strokeWidth={location.pathname === '/android-history' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">History</span>
          </Link>

          <Link 
            to="/settings"
            className={`flex flex-col items-center gap-1.5 flex-1 transition-all no-underline ${location.pathname.includes('settings') ? 'text-rose-500' : 'text-gray-400 dark:text-zinc-600'}`}
          >
            <SettingsIcon size={24} strokeWidth={location.pathname.includes('settings') ? 2.5 : 2} />
            <span className="text-[10px] font-bold">Settings</span>
          </Link>
        </nav>
      )}

      {/* Sidebar History Drawer */}
      <aside className={`fixed top-0 right-0 h-screen w-full sm:w-80 bg-white dark:bg-zinc-950 border-l border-gray-100 dark:border-zinc-800 z-[150] shadow-2xl transition-transform duration-500 ease-out transform ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <HistoryIcon size={24} className="text-rose-500" />
              <h2 className="text-xl font-black dark:text-white">Activity</h2>
            </div>
            <div className="flex items-center gap-2">
              {activity.length > 0 && (
                <button 
                  onClick={() => clearActivity().then(() => setActivity([]))} 
                  className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                  aria-label="Clear Activity"
                >
                  <Trash2Icon size={18} />
                </button>
              )}
              <button 
                onClick={() => setShowHistory(false)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-gray-400"
                aria-label="Close Activity Drawer"
              >
                <ChevronRightIcon size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {activity.length === 0 ? (
              <div className="text-center py-20 opacity-40">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">No recent files</p>
              </div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-between group">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate dark:text-zinc-200">{item.name}</p>
                    <p className="text-[10px] text-gray-400">{item.tool} • {(item.size / (1024*1024)).toFixed(2)} MB</p>
                  </div>
                  {item.resultUrl && (
                    <a 
                      href={item.resultUrl}
                      download={item.name}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-xl text-rose-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                      aria-label="Download Item"
                    >
                      <DownloadIcon size={16} />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
