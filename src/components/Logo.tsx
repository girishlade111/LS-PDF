export const LsPdfLogo = ({ size = 24, className = "", iconColor }: { size?: number, className?: string, iconColor?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M5 3H19V23H5V3Z" fill={iconColor || "#F43F5E"} />
    <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
)