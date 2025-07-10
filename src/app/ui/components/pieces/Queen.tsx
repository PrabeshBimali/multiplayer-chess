import { SVGPieceProps } from "@/app/types/global.types";

export default function Queen(props: SVGPieceProps) {
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
      {/* Queen's crown with subtle outline */}
      <path 
        d="M34.965,23l3.89,10h22.291l3.89-10H34.965z M65.424,22l2.44-6.275l-3.729-1.449l-1.361,3.501
        c-1.851-0.886-5.641-1.543-10.218-1.724C53.432,15.318,54,14.23,54,13c0-2.209-1.791-4-4-4s-4,1.791-4,4
        c0,1.23,0.568,2.318,1.443,3.053c-4.577,0.181-8.367,0.838-10.218,1.724l-1.361-3.501l-3.729,1.449L34.576,22H65.424z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Queen's body with subtle outline */}
      <path 
        d="M40.973,39c-0.277,29.941-2.637,33.514-3.583,40H62.61c-0.946-6.486-3.306-10.059-3.583-40H40.973z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Horizontal band with subtle outline */}
      <path 
        d="M63,36c0,1.1-0.9,2-2,2H39c-1.1,0-2-0.9-2-2s0.9-2,2-2h22C62.1,34,63,34.9,63,36z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Base platforms with subtle outline */}
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