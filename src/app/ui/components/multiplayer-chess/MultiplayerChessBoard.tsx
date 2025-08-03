"use client"

import { ReactElement, useEffect, useState, useRef, useCallback } from "react"
import Pawn from "../pieces/Pawn"
import Rook from "../pieces/Rook"
import Knight from "../pieces/Knight"
import Bishop from "../pieces/Bishop"
import Queen from "../pieces/Queen"
import King from "../pieces/King"
import { FrontendBoard, Position, PreviousMove, ValidMovesFrontend } from "@/app/types/global.types"
import { MovePayload, MoveResult, Piece } from "@/app/types/global.interfaces"
import { PieceColor, PieceType } from "@/app/types/global.enums"
import PromotionModal from "../Promotion"
import Board from "@/app/lib/Board"
import { useSocket } from "@/app/context/SocketProvider"
import { ValidMoves } from "@/app/chess-engine/types/backend.type"
import CheckmateModal from "../CheckmateModal"
import { useToast } from "@/app/context/ToastProvider"

interface MultiplayerChessBoardProps {
  newPlayerJoined: boolean
}

export default function MultiplayerChessBoard(props: MultiplayerChessBoardProps) {

  const { newPlayerJoined } = props

  const socket = useSocket()
  const { addToast } = useToast()

  const pieceSize: number = 50

  const [playerId, setPlayerId] = useState<string | null>(null)
  const [gameId, setGameId] = useState<string | null>(null)
  const [myColor, setMyColor] = useState<PieceColor | null>(null)

  const [board, setBoard] = useState<FrontendBoard>([])
  const [selectedPosition, setSelectedPosition] = useState<Position>({row: -1, col: -1})
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null)
  const [validMoves, setValidMoves] = useState<Array<Position>>([])
  const [attackMoves, setAttackMoves] = useState<Array<Position>>([])
  const [previousMoves, setPreviousMoves] = useState<Array<Position>>([])
  const [turn, setTurn] = useState<PieceColor | null>(null)
  const [checkmate, setCheckmate] = useState<PieceColor | null>(null)
  const [showPromotionalModal, setShowPromotionalModal] = useState<boolean>(false)
  const [openCheckmateModal, setOpenCheckmateModal] = useState<boolean>(false)
    
  const handleMoveSuccess = useCallback((result: MoveResult) => {

    const { turn, fen, checkmate, previousMove } = result

    const newBoard = new Board(fen)
    setBoard(newBoard.getBoard())
    setSelectedPiece(null)
    setSelectedPosition({ row: -1, col: -1 })
    setValidMoves([])
    setAttackMoves([])
    setTurn(turn)
    setCheckmate(checkmate)

    if (previousMove !== null) {
      setPreviousMoves([
        { row: previousMove.from.row, col: previousMove.from.col },
        { row: previousMove.to.row, col: previousMove.to.col },
      ])
    }
  }, [])

  const handleMoveError = useCallback((error: string) => {
    addToast(error, "warning", 3000)
  }, [])
  
  const bitboardIndexToPosition = (index: number): Position => {
    const row = (7 - Math.floor(index/8))
    const col = (7 - (index%8))
    return { row, col }
  }

  const convertValidMovesForFrontend = (movesFromBackend: ValidMoves): ValidMovesFrontend => {
    const normalMoves = []
    const captureMoves = []
    for (const i of movesFromBackend.normalMoves) {
      const pos = bitboardIndexToPosition(i)
      normalMoves.push(pos)
    }

    for(const i of movesFromBackend.captureMoves) {
      const pos = bitboardIndexToPosition(i)
      captureMoves.push(pos)
    }

    return {normalMoves, captureMoves}
  }

  const handleValidMovesSuccess = useCallback((result: ValidMoves) => {
    const moves = result
    const frontendMoves = convertValidMovesForFrontend(moves)
    
    const normalMoves: Array<Position> = frontendMoves.normalMoves
    const attackMoves: Array<Position> = frontendMoves.captureMoves
    setValidMoves(normalMoves)
    setAttackMoves(attackMoves)
  }, [])

  const handlePromotePawn = useCallback(() => {
    setShowPromotionalModal(true)
  }, [])
  
  const handlePromoteSuccess = useCallback((result: MoveResult) => {

    const { turn, fen, checkmate, previousMove } = result

    const newBoard = new Board(fen)
    setBoard(newBoard.getBoard())
    setSelectedPiece(null)
    setSelectedPosition({ row: -1, col: -1 })
    setValidMoves([])
    setAttackMoves([])
    setTurn(turn)
    setCheckmate(checkmate)
    setShowPromotionalModal(false)

    if (previousMove !== null) {
      setPreviousMoves([
        { row: previousMove.from.row, col: previousMove.from.col },
        { row: previousMove.to.row, col: previousMove.to.col },
      ])
    }
  }, [])

  useEffect(() => {
    if (!socket) return


    socket.on("move-success", handleMoveSuccess)
    socket.on("valid-moves-success", handleValidMovesSuccess)
    socket.on("pawn-can-promote", handlePromotePawn)
    socket.on("promote-success", handlePromoteSuccess)
    socket.on("move-error", handleMoveError)

    return () => {
      socket.off("move-success", handleMoveSuccess)
      socket.off("valid-moves-success", handleValidMovesSuccess)
      socket.off("pawn-can-promote", handlePromotePawn)
      socket.off("promote-success", handlePromoteSuccess)
      socket.off("move-error", handleMoveError)
    }
  }, [socket])
  
  useEffect(() : void => {
    async function initializeGame() {
      let storedPlayerId: string | null = localStorage.getItem("playerid")
      let storedGameId: string | null = localStorage.getItem("gameid")
      let storedColor: string | null = localStorage.getItem("color")
      let color: PieceColor | null = storedColor === PieceColor.WHITE || storedColor === PieceColor.BLACK ? storedColor : null

      if(!storedPlayerId || storedPlayerId === "undefined") {
        storedPlayerId = null
      }

      if(!storedGameId || storedGameId === "undefined") {
        storedGameId = null
      }

      setPlayerId(storedPlayerId)
      setGameId(storedGameId)
      setMyColor(color)
      
      
      const url: string | undefined = process.env.NEXT_PUBLIC_API_URL + `/state/game-state?gameid=${storedGameId}`

      if(!url) {
        console.error(`Invalid URL: ${url}`)
        return;
      }

      try{
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })

        if(!response.ok) {
          throw new Error(`HTTP status error: ${response.status}`)
        }

        const data = await response.json()
        const initialState: MoveResult = {
          fen: data.state.fen,
          turn: data.state.turn,
          previousMove: data.state.previousMove,
          checkmate: data.state.checkmate
        }
        
        const initialBoard = new Board(initialState.fen)
        setBoard(initialBoard.getBoard())
        setTurn(initialState.turn)
        setCheckmate(initialState.checkmate) 
        const prevMove: PreviousMove | null = initialState.previousMove
        if(prevMove !== null) {
          setPreviousMoves([{row: prevMove.from.row, col: prevMove.from.col},
                              {row: prevMove.to.row, col: prevMove.to.col}])

        }
      } catch(e) {
        console.error(e)
      }
    }

    initializeGame()
  }, [newPlayerJoined])

  useEffect((): void => {
    if(checkmate) {
      setOpenCheckmateModal(true)
    }
  }, [checkmate])

  function handleSquareClicked(row: number, col: number) {

    if(turn !== myColor || checkmate !== null) return

    const position: Position = {row: row, col: col}
    const currentPiece: Piece | null = board[position.row][position.col]
    

    if(!socket) return

    if(!playerId || !gameId) return

    // do this if piece is already selected
    // only move when clicked in empty suares or enemy piece
    if(selectedPiece !== null && (currentPiece === null || currentPiece.getColor() !== turn)) {

      const movePayload: MovePayload = {
        playerid: playerId,
        gameid: gameId,
        from: selectedPosition,
        to: position,
        type: selectedPiece.getType(),
        color: selectedPiece.getColor()
      }

      socket.emit("move", movePayload)
      return
    }
    
    if(currentPiece === null || currentPiece.getColor() !== turn) {
      setSelectedPosition({row: -1, col: -1})
      setValidMoves([])
      setAttackMoves([])
      setSelectedPiece(null)
      return
    }

    if(turn === myColor) {
      setSelectedPiece(currentPiece)
      setSelectedPosition(position)

      socket.emit("valid-moves", {
        playerid: playerId, 
        gameid: gameId, 
        position, 
        type: currentPiece.getType(), 
        color: currentPiece.getColor()}
      )
    }
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
    if(!socket) return

    if(!playerId || !gameId) return

    socket.emit("promote-pawn", {
      playerid: playerId,
      gameid: gameId,
      color: color,
      type: type
    })
  }

  return (
    <>
        {
          openCheckmateModal && checkmate !== null && myColor !== null ? 
            <CheckmateModal checkmateColor={checkmate} playerColor={myColor} setOpenCheckmateModal={setOpenCheckmateModal}/> : 
            ""
        }
        <div className={`w-full order-1 2xl:order-2 ${myColor === PieceColor.BLACK ? "rotate-180" : ""}`}>
          {showPromotionalModal && turn !== null ? <PromotionModal color={turn} promotePawn={promotePawn}/> : ""}
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
                      <div className={`${myColor === PieceColor.BLACK ? "rotate-180" : ""}`}>
                        {renderPieces(piece)}
                      </div>
                      { isValidMoveForSelectedPiece ? <div className="w-1/3 h-1/3 bg-green-800 rounded-full opacity-80"></div> : ""}
                    </div>
                  )
                })}
            </div>
            )
          })}
        </div>
        <div className="text-white font-semibold bg-gray-900 inline-block py-1 px-2 rouned-sm">
          Turn: {myColor === turn ? "Your turn" : "Opponent's Turn"}
        </div>
    </>
  )
}