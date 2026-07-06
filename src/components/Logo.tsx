export const LsPdfLogo = ({ size = 24, className = "", iconColor }: { size?: number, className?: string, iconColor?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M6 4H20V24H6V4Z" fill="#BE123C" />
    <path d="M4 2H18V22H4V2Z" fill={iconColor || "#F43F5E"} />
  </svg>
)