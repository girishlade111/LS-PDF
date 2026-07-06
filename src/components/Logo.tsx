export const LsPdfLogo = ({ size = 24, className = "", iconColor, partColor }: { size?: number, className?: string, iconColor?: string, partColor?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="paper-grain" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0" result="grain" />
        <feBlend mode="multiply" in="grain" in2="SourceGraphic" />
      </filter>
    </defs>
    <path d="M5 3H19V19L15 23H5V3Z" fill={iconColor || "#F43F5E"} filter="url(#paper-grain)" />
    <path d="M7.5 8.5H16.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity={0.55} />
    <path d="M7 12H17" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity={0.4} />
    <path d="M7 15.5H15" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity={0.25} />
    <path d="M19 19L15 23H19V19Z" fill={partColor || "currentColor"} className={!partColor ? "fill-zinc-950 dark:fill-white transition-colors duration-300" : ""} filter="url(#paper-grain)" />
  </svg>
)