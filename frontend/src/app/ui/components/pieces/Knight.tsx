import { SVGPieceProps } from "@/app/types/global.types";

export default function Knight(props: SVGPieceProps) {
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
      {/* Main knight body with subtle outline */}
      <path 
        d="M31.375,40.219l1.249,1.563l-5.475,4.379C27.676,48.357,29.645,50,32,50c2.527,0,4.622-1.885,4.954-4.32l5.849-2.508
        c2.944,2.451,7.337,2.297,10.097-0.465c2.924-2.924,2.924-7.682,0-10.606l0.707-0.707c1.605,1.605,2.49,3.739,2.49,6.011
        c0,1.328-0.311,2.607-0.884,3.764l0,0c-0.196,0.396-0.425,0.775-0.681,1.14c-0.024,0.034-0.05,0.066-0.074,0.1
        c-0.256,0.353-0.536,0.692-0.851,1.007c-0.276,0.276-0.57,0.523-0.873,0.752c-0.07,0.053-0.143,0.101-0.213,0.15
        c-0.252,0.179-0.51,0.344-0.775,0.492c-1.508,0.844-3.216,1.203-4.894,1.057C45.944,52.158,40.545,57,34,57l2,22h28
        c0-9.957,2.698-18.563,5.535-25.822C64.908,57.412,58.751,60,52,60v-1c13.785,0,25-11.215,25-25S65.785,9,52,9h-1v10h-1v-4h-7
        c-3.866,0-7,3.134-7,7c0,1.831-16,7.76-16,16c0,3.38,2.395,6.199,5.58,6.855L31.375,40.219z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Decorative elements with subtle outline */}
      <path 
        d="M45.485,20.143l1.029,1.715l-5,3l-1.029-1.715L45.485,20.143z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      <path 
        d="M23.445,38.168l3-2l1.109,1.664l-3,2L23.445,38.168z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      
      {/* Base platform with subtle outline */}
      <path 
        d="M69,80c1.1,0,2,0.9,2,2s-0.9,2-2,2H31c-1.1,0-2-0.9-2-2s0.9-2,2-2H69z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
      <path 
        d="M76,89c0,2.2-1.8,4-4,4H28c-2.2,0-4-1.8-4-4s1.8-4,4-4h44C74.2,85,76,86.8,76,89z" 
        fill={color}
        stroke={outlineColor}
        strokeWidth={outlineWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}