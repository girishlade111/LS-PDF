export const LsPdfLogo = ({ size = 24, className = "", iconColor }: { size?: number, className?: string, iconColor?: string }) => (
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
    <path d="M5 3H19V23H5V3Z" fill={iconColor || "#F43F5E"} filter="url(#paper-grain)" />
    <text x="12" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="7.5" fill="white" letter-spacing="1">PDF</text>
  </svg>
)