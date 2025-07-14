import { SVGPieceProps } from "@/app/types/global.types";

export default function Rook(props: SVGPieceProps) {
  const { size, color } = props;
  
  // Determine outline color - dark for white pieces, light for black pieces
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
      {/* Base platform with subtle outline */}
      <path 
        d="M30 84h40c1.1 0 2-0.9 2-2s-0.9-2-2-2H30c-1.1 0-2 0.9-2 2S28.9 84 30 84z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Bottom stand with subtle outline */}
      <path 
        d="M73 85H27c-2.2 0-4 1.8-4 4s1.8 4 4 4h46c2.2 0 4-1.8 4-4S75.2 85 73 85z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Main body with subtle outline */}
      <path 
        d="M68.262 79C66.464 72.752 62 70.139 62 35H38c0 35.139-4.464 37.752-6.262 44H68.262z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Crown top with subtle outline */}
      <path 
        d="M31 25V10h7v6h6v-6h12v6h6v-6h7v15c0 2.2-1.8 4-4 4H35C32.8 29 31 27.2 31 25z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Crown middle with subtle outline */}
      <path 
        d="M65 34c1.1 0 2-0.9 2-2s-0.9-2-2-2H35c-1.1 0-2 0.9-2 2s0.9 2 2 2H65z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}