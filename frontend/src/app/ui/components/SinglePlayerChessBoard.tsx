"use client"

import { ReactElement, useEffect, useState, useRef } from "react"
import Pawn from "./pieces/Pawn"
import Rook from "./pieces/Rook"
import Knight from "./pieces/Knight"
import Bishop from "./pieces/Bishop"
import Queen from "./pieces/Queen"
import King from "./pieces/King"
import { FrontendBoard, Position, ValidMovesFrontend } from "@/app/types/global.types"
import { Piece } from "@/app/types/global.interfaces"
import { PieceColor, PieceType } from "@/app/types/global.enums"
import PromotionModal from "./Promotion"
import SinglePlayerGameClient from "@/app/lib/SinglePlayerGameClient"
import { useToast } from "@/app/context/ToastProvider"

export default function SiglePlayerChessBoard() {

  const { addToast } = useToast()

  const gameRef = useRef<SinglePlayerGameClient | null>(null)

  if (gameRef.current === null) {
    gameRef.current = new SinglePlayerGameClient()
  }
  const game = gameRef.current
  const initialBoardState: FrontendBoard = game.getBoard()
  const pieceSize: number = 50

  const [board, setBoard] = useState<FrontendBoard>([])
  const [selectedPosition, setSelectedPosition] = useState<Position>({row: -1, col: -1})
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null)
  const [validMoves, setValidMoves] = useState<Array<Position>>([])
  const [attackMoves, setAttackMoves] = useState<Array<Position>>([])
  const [previousMoves, setPreviousMoves] = useState<Array<Position>>([])
  const [turn, setTurn] = useState<PieceColor>(game.getTurn())
  const [checkmate, setCheckmate] = useState<PieceColor | null>(null)
  const [showPromotionalModal, setshowPromotionalModal] = useState<boolean>(false)


  useEffect(() : void => {
    setBoard(initialBoardState)
  }, [])

  function handleSquareClicked(row: number, col: number) {
      addToast("King in Check", "error", 3000)
      const position: Position = {row: row, col: col}
      const currentPiece: Piece | null = board[position.row][position.col]
    
      // do this if piece is already selected
      try {
        // only move when clicked in empty suares or enemy piece
        if(selectedPiece !== null && (currentPiece === null || currentPiece.getColor() !== turn)) {
          game.moveAPiece(selectedPosition, position, selectedPiece.getType(), selectedPiece.getColor())
          setBoard(game.getBoard())
          setSelectedPiece(null)
          setSelectedPosition({row: -1, col: -1})
          setValidMoves([])
          setAttackMoves([])
          setTurn(game.getTurn())
          setCheckmate(game.getCheckmate())
          const prevMoves = game.getPreviousMove()
          setPreviousMoves([{row: prevMoves[0].row, col: prevMoves[0].col},
                            {row: prevMoves[1].row, col: prevMoves[1].col}])
          
          if(game.canPawnPromote(turn)) {
            setshowPromotionalModal(true)
          }
          return
        }
      } catch(e) {
        console.error(e)
      }
      
      if(currentPiece === null || currentPiece.getColor() !== turn) {
        setSelectedPosition({row: -1, col: -1})
        setValidMoves([])
        setAttackMoves([])
        setSelectedPiece(null)
        return
      }

      setSelectedPiece(currentPiece)
      setSelectedPosition(position)
      const moves: ValidMovesFrontend = game.getPossibleMovesForAPiece(position, currentPiece.getType(), currentPiece.getColor())
      const normalMoves: Array<Position> = moves.normalMoves
      const attackMoves: Array<Position> = moves.captureMoves
      setValidMoves(normalMoves)
      setAttackMoves(attackMoves)
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

  function promotePawn(color: PieceColor, type: PieceType): void {
    console.log(color, " ", type)
    game.promoteAPawn(color, type)
    setBoard(game.getBoard())
    setSelectedPiece(null)
    setSelectedPosition({row: -1, col: -1})
    setValidMoves([])
    setAttackMoves([])
    setTurn(game.getTurn())
    setCheckmate(game.getCheckmate())
    setshowPromotionalModal(false)
  }

  return (
    <>
      <div className="grid 2xl:grid-cols-3 grid-cols-1 gap-5">
        <div className="order-3 2xl:order-1">Here is where chat goes</div>
        <div className="w-full order-1 2xl:order-2">
          <div>Black: {turn === PieceColor.BLACK ? "your turn" : "opponent's turn"}</div>
          {showPromotionalModal ? <PromotionModal color={turn} promotePawn={promotePawn}/> : ""}
          {board.map((row: Array<Piece|null>, rowIndex: number) => {
            return( 
              <div 
                className={`grid grid-cols-8`}
                key={rowIndex}
              >
                {row.map((piece: Piece | null, colIndex: number) => {

                  const isSelected: boolean = rowIndex === selectedPosition?.row && colIndex === selectedPosition?.col
                  const isValidMoveForSelectedPiece: boolean = validMoves.some((pos) => pos.row === rowIndex && pos.col === colIndex)
                  const isAttackMoveForSelectedPiece: boolean = attackMoves.some((pos) => pos.row === rowIndex && pos.col === colIndex)
                  const isPreviousMoves: boolean = previousMoves.some((pos) => pos.row === rowIndex && pos.col === colIndex)
                  const linearPosition = rowIndex + colIndex
                  return (
                    <div 
                      key={linearPosition} 
                      className=
                        {`
                          aspect-square flex justify-center items-center
                          ${piece !== null ? "cursor-pointer": ""}
                          ${((linearPosition)%2 === 0) ? "bg-chess1-light" : "bg-chess1-dark"}
                          ${isSelected ? "bg-green-900 opacity-80" : ""}
                          ${isPreviousMoves && !isAttackMoveForSelectedPiece ? ((linearPosition)%2 === 0 ? "bg-lime-200": "bg-green-600 opacity-80") : ""}
                          ${isAttackMoveForSelectedPiece ? (linearPosition%2 === 0 ? "bg-red-300" : "bg-red-400"): ""}
                        `}
                      onClick={() => handleSquareClicked(rowIndex, colIndex)}
                    >
                      {renderPieces(piece)}
                      { isValidMoveForSelectedPiece ? <div className="w-1/3 h-1/3 bg-green-800 rounded-full opacity-80"></div> : ""}
                    </div>
                  )
                })}
            </div>
            )
          })}
          <div>White: {turn === PieceColor.WHITE ? "your turn" : "opponent's turn"}</div>
        </div>
        <div className="order-2 2xl:order-3">
          <div>Turn: {turn}</div>
          <div className={`${checkmate === null ? "text-white" : "text-black"}`}>
            {checkmate === PieceColor.WHITE ? "White checkmate, Black Wins!" : "Black checkmate, White Wins!"}
          </div>
        </div>
      </div>
    </>
  )
}