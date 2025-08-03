import Game from "../chess-engine/Game";
import { ValidMoves } from "../chess-engine/types/backend.type";
import { PieceColor, PieceType } from "../types/global.enums";
import { FrontendBoard, Position, PreviousMove, ValidMovesFrontend } from "../types/global.types";
import Board from "./Board";

export default class SinglePlayerGameClient {
  private backendGame: Game = new  Game()
  private turn: PieceColor = this.backendGame.getTurn()
  private fen: string = this.backendGame.getFen()
  private checkmate: PieceColor | null = this.backendGame.getCheckmate()
  private board: Board = new Board(this.fen)
  private previousMove: PreviousMove | null = this.backendGame.getPreviousMove()

  moveAPiece(from: Position, to: Position, type: PieceType, color: PieceColor) {
    this.backendGame.moveAPiece(from, to, type, color)
    this.fen = this.backendGame.getFen()
    this.turn = this.backendGame.getTurn()
    this.checkmate = this.backendGame.getCheckmate()
    this.board.converFENToBoardState(this.fen)
    this.previousMove = this.backendGame.getPreviousMove()
  }
  
  promoteAPawn(color: PieceColor, type: PieceType) {
    this.backendGame.promoteAPawn(color, type)
    this.fen = this.backendGame.getFen()
    this.turn = this.backendGame.getTurn()
    this.checkmate = this.backendGame.getCheckmate()
    this.board.converFENToBoardState(this.fen)
    this.previousMove = this.backendGame.getPreviousMove()
  }

  private bitboardIndexToPosition(index: number): Position {
    const row = (7 - Math.floor(index/8))
    const col = (7 - (index%8))
    return { row, col }
  }

  canPawnPromote(color: PieceColor): boolean {
    return this.backendGame.canPawnPromote(color)
  }


  getPossibleMovesForAPiece(piecePos: Position, type: PieceType, color: PieceColor): ValidMovesFrontend {
    const moves: ValidMoves = this.backendGame.getPossibleMovesForAPiece(piecePos, type, color)
    const normalMoves = []
    const captureMoves = []
    for (const i of moves.normalMoves) {
      const pos = this.bitboardIndexToPosition(i)
      normalMoves.push(pos)
    }

    for(const i of moves.captureMoves) {
      const pos = this.bitboardIndexToPosition(i)
      captureMoves.push(pos)
    }

    return {normalMoves, captureMoves}
  }

  getBoard(): FrontendBoard {
    return this.board.getBoard()
  }

  getTurn(): PieceColor {
    return this.turn
  }

  getCheckmate(): PieceColor | null {
    return this.checkmate
  }

  getPreviousMove(): Array<Position> {
    if(this.previousMove === null) return []
    let prevMoves: Array<Position> = []
    prevMoves.push(this.previousMove.from)
    prevMoves.push(this.previousMove.to)
    return prevMoves
  }
}