import { SVGPieceProps } from "@/app/types/global.types";

export default function Pawn(props: SVGPieceProps) {
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
      {/* Head with subtle outline */}
      <circle 
        cx="50" 
        cy="22" 
        r="13" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
      />
      
      {/* Neck with subtle outline */}
      <path 
        d="M63,38c0,1.65-1.35,3-3,3H40c-1.65,0-3-1.35-3-3l0,0c0-1.65,1.35-3,3-3h20C61.65,35,63,36.35,63,38L63,38z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Body with subtle outline */}
      <path 
        d="M63.99,79C62.052,74.959,58,74.478,58,41H42
        c0,33.478-4.052,33.959-5.99,38H63.99z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Upper base platform with subtle outline */}
      <path 
        d="M68,82c0,1.65-1.35,3-3,3H35c-1.65,0-3-1.35-3-3
        l0,0c0-1.65,1.35-3,3-3h30C66.65,79,68,80.35,68,82L68,82z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Lower base platform with subtle outline */}
      <path 
        d="M73,89c0,2.2-1.8,4-4,4H31c-2.2,0-4-1.8-4-4l0,0
        c0-2.2,1.8-4,4-4h38C71.2,85,73,86.8,73,89L73,89z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}