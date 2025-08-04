"use client"

import { PieceColor, PieceType } from "@/app/types/global.enums"

interface PromotionModalProps {
  color: PieceColor,
  promotePawn: (color: PieceColor, type: PieceType) => void
}

export default function PromotionModal({ color, promotePawn }: PromotionModalProps) {
  const promotionPieces: PieceType[] = [
    PieceType.QUEEN,
    PieceType.ROOK,
    PieceType.BISHOP,
    PieceType.KNIGHT
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay with opacity */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Modal content - no opacity here */}
      <div className="relative bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col gap-4 items-center">
        <h2 className="text-xl font-semibold text-white">Promote Pawn</h2>
        <div className="flex gap-4">
          {promotionPieces.map((type) => (
            <button
              key={type}
              onClick={() => promotePawn(color, type)}
              className="w-16 h-16 rounded-full border border-gray-400 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl text-gray-800 font-medium cursor-pointer"
            >
              {
                (() => {
                  switch (type) {
                    case PieceType.QUEEN:
                      return (color === PieceColor.BLACK ? "♛" : "♕");
                    case PieceType.ROOK:
                      return (color === PieceColor.BLACK ? "♜" : "♖");
                    case PieceType.BISHOP:
                      return (color === PieceColor.BLACK ? "♝" : "♗");
                    case PieceType.KNIGHT:
                      return (color === PieceColor.BLACK ? "♞" : "♘");
                    default:
                      return "?";
                  }
                })()
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}