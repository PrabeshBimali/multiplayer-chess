import { SVGPieceProps } from "@/app/types/global.types";

export default function Bishop(props: SVGPieceProps) {
  const { size, color } = props;
  
  // Determine outline color - light gray for white pieces, dark gray for black pieces
  const outlineColor = color === "white" ? "#333" : "#ddd";
  const outlineWidth = Math.max(1, size * 0.04); // Responsive outline width
  
  return (
    <svg 
      viewBox="0 0 100 100"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none"
    >
      {/* Bishop's mitre (top part) with subtle outline */}
      <path 
        d="M59 37c0 0 4-6 4-11c0-4.411-10.112-13.488-12.496-19h-1.008c-0.871 2.015-2.776 4.506-4.842 7.072l4.24 8.48l-1.789 0.895
        l-3.834-7.668C40.1 19.686 37 23.558 37 26c0 5 4 11 4 11H59z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Bishop's body with subtle outline */}
      <path 
        d="M40.95 43c-0.358 27.588-2.586 30.262-3.528 36h25.156c-0.942-5.738-3.17-8.412-3.528-36H40.95z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Horizontal band with subtle outline */}
      <path 
        d="M37 40c0-1.1 0.9-2 2-2h22c1.1 0 2 0.9 2 2s-0.9 2-2 2H39C37.9 42 37 41.1 37 40z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Base platforms with subtle outline */}
      <path 
        d="M34 84h32c1.1 0 2-0.9 2-2s-0.9-2-2-2H34c-1.1 0-2 0.9-2 2S32.9 84 34 84z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      <path 
        d="M69 85H31c-2.2 0-4 1.8-4 4s1.8 4 4 4h38c2.2 0 4-1.8 4-4S71.2 85 69 85z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}