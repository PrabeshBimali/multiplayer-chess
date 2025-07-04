"use client"

import { ReactElement, useEffect, useState, useRef } from "react"
import Pawn from "./pieces/Pawn"
import Rook from "./pieces/Rook"
import Knight from "./pieces/Knight"
import Bishop from "./pieces/Bishop"
import Queen from "./pieces/Queen"
import King from "./pieces/King"
import { FrontendBoard, Position } from "@/app/types/global.types"
import { Piece } from "@/app/types/global.interfaces"
import { PieceColor, PieceType } from "@/app/types/global.enums"
import ClientGame from "@/app/lib/ClientGame"

export default function VisualBoard() {

  const gameRef = useRef<ClientGame | null>(null)

  if (gameRef.current === null) {
    gameRef.current = new ClientGame()
  }
  const game = gameRef.current
  const initialBoardState: FrontendBoard = game.getBoard()
  const pieceSize: number = 60

  const [board, setBoard] = useState<FrontendBoard>([])
  const [selectedPosition, setSelectedPosition] = useState<Position>({row: -1, col: -1})
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null)
  const [validMoves, setValidMoves] = useState<Array<Position>>([])
  const [turn, setTurn] = useState<PieceColor>(game.getTurn())

  useEffect(() : void => {
    setBoard(initialBoardState)
  }, [])

  function handleSquareClicked(row: number, col: number) {
    console.log(turn)
    const position: Position = {row: row, col: col}
    
    // do this if piece is already selected
    if(selectedPiece !== null) {
      console.log("hmmm")
      game.moveAPiece(selectedPiece.getType(), selectedPosition, position)
      setBoard(game.getBoard())
      setSelectedPiece(null)
      setSelectedPosition({row: -1, col: -1})
      setValidMoves([])
      setTurn(game.getTurn())
      return
    }

    const currentPiece: Piece | null = board[position.row][position.col]

    if(currentPiece === null) {
      setSelectedPosition({row: -1, col: -1})
      setValidMoves([])
      setSelectedPiece(null)
      return
    }

    if(currentPiece.getColor() !== turn) {
      setSelectedPosition({row: -1, col: -1})
      setValidMoves([])
      setSelectedPiece(null)
      return
    }

    setSelectedPiece(currentPiece)
    setSelectedPosition(position)
    const moves: Array<Position> = currentPiece.getValidMoves(position, board)
    setValidMoves(moves)

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
                const isValidMoveForSelectedPiece: boolean = validMoves.some((pos) => pos.row === rowIndex && pos.col === colIndex)
                return (
                  <div 
                    key={rowIndex+colIndex} 
                    className=
                      {`
                        aspect-square border border-amber-800 flex justify-center items-center
                        ${piece !== null ? "cursor-pointer": ""}
                        ${((rowIndex + colIndex)%2 === 0) ? "bg-gray-300" : "bg-blue-300"}
                        ${isSelected ? "bg-lime-600" : ""}
                        ${isValidMoveForSelectedPiece ? "bg-lime-400 opacity-50" : ""}
                        ${isValidMoveForSelectedPiece}
                      `}
                    onClick={() => handleSquareClicked(rowIndex, colIndex)}
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