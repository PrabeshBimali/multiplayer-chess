import { SVGPieceProps } from "@/app/types/global.types";

export default function King(props: SVGPieceProps) {
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
      {/* Crown with cross - subtle outline */}
      <path 
        d="M37,20l0.615,2h24.77L63,20l-11-4.23V11h2V7h-2V5h-4v2h-2v4h2v4.77L37,20z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Neck - subtle outline */}
      <path 
        d="M59,33l3.077-10H37.923L41,33H59z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Body - subtle outline */}
      <path 
        d="M40.973,39c-0.277,29.941-2.637,33.514-3.583,40H62.61c-0.946-6.486-3.306-10.059-3.583-40H40.973z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Horizontal band - subtle outline */}
      <path 
        d="M37,36c0-1.1,0.9-2,2-2h22c1.1,0,2,0.9,2,2s-0.9,2-2,2H39C37.9,38,37,37.1,37,36z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Base platforms - subtle outline */}
      <path 
        d="M34,84h32c1.1,0,2-0.9,2-2s-0.9-2-2-2H34c-1.1,0-2,0.9-2,2S32.9,84,34,84z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      <path 
        d="M69,85H31c-2.2,0-4,1.8-4,4s1.8,4,4,4h38c2.2,0,4-1.8,4-4S71.2,85,69,85z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}