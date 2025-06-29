"use client"

import { ReactElement, useEffect, useState } from "react"
import Pawn from "./pieces/Pawn"
import Rook from "./pieces/Rook"
import Knight from "./pieces/Knight"
import Bishop from "./pieces/Bishop"
import Queen from "./pieces/Queen"
import King from "./pieces/King"
import { FrontendBoard, Position } from "@/app/types/global.types"
import Board from "@/app/lib/Board"
import { Piece } from "@/app/types/global.interfaces"
import { PieceType } from "@/app/types/global.enums"

export default function VisualBoard() {

  const initializeBoard: Board = new Board()
  const initialBoardState: FrontendBoard = initializeBoard.getBoard()
  const pieceSize: number = 60

  const [board, setBoard] = useState<FrontendBoard>([])
  const [selectedPosition, setSelectedPosition] = useState<Position>({row: -1, col: -1})

  useEffect(() : void => {
    setBoard(initialBoardState)
  }, [])

  function handlePieceClicked(row: number, col: number) {
    if(initialBoardState[row][col] === null) {
      setSelectedPosition({row: -1, col: -1})
      return
    }

    setSelectedPosition({row, col})
  }

  function renderPieces(piece: Piece | null): ReactElement | undefined {
    if(piece === null) return

    switch(piece.getType()) {
      case PieceType.PAWN:
        return <Pawn size={pieceSize} color={piece.getColor()}></Pawn>
      
      case PieceType.ROOK:
        return <Rook size={pieceSize} color={piece.getColor()}></Rook>
      
      case PieceType.KNIGHT:
        return <Knight size={pieceSize} color={piece.getColor()}></Knight>
      
      case PieceType.BISHOP:
        return <Bishop size={pieceSize} color={piece.getColor()}></Bishop>

      case PieceType.QUEEN:
        return <Queen size={pieceSize} color={piece.getColor()}></Queen>

      case PieceType.KING:
        return <King size={pieceSize} color={piece.getColor()}></King>

      default:
        return
    }
  }

  return (
    <>
    <div className="flex justify-center">
      <div className="w-full max-w-[80vh] h-[80vh]">
        {board.map((row: Array<Piece|null>, rowIndex: number) => {
          return( 
            <div 
              className={`grid grid-cols-8`}
              key={rowIndex}
            >
              {row.map((piece: Piece | null, colIndex: number) => {

                const isSelected: boolean = rowIndex === selectedPosition?.row && colIndex === selectedPosition?.col

                return (
                  <div 
                    key={rowIndex+colIndex} 
                    className=
                      {`
                        aspect-square border border-amber-800 flex justify-center items-center
                        ${piece !== null ? "cursor-pointer": ""}
                        ${((rowIndex + colIndex)%2 === 0) ? "bg-gray-300" : "bg-blue-300"}
                        ${isSelected ? "bg-lime-500": ""}
                      `}
                    onClick={() => handlePieceClicked(rowIndex, colIndex)}
                  >
                    {renderPieces(piece)}
                  </div>
                )
              })}
          </div>
          )
        })}
      </div>
    </div>
    </>
  )
}