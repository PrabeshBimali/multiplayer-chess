import { PieceColor, PieceType } from "../types/global.enums";
import { Position, PreviousMove } from "../types/global.types";
import BitBoard from "./BitBoard";
import { Move, ValidMoves } from "./types/backend.type";

export default class Game {
  private turn: PieceColor = PieceColor.WHITE
  private fen: string
  private bitboard: BitBoard = new BitBoard()
  private checkmate: PieceColor | null = null
  private previousMove: PreviousMove | null = null

  constructor() {
    this.fen = this.bitboard.generateFENFromBitBoard()
  }

  private positionToBitBoardIndex(row: number, col: number): number {
    return ((7-row) * 8) + (7-col)
  }

  moveAPiece(from: Position, to: Position, type: PieceType, color: PieceColor) {
    if(this.turn !== color) {
      throw new Error(`Not ${color} Turn`)
    }

    const fromPosition: number = this.positionToBitBoardIndex(from.row, from.col)
    const toPosition: number = this.positionToBitBoardIndex(to.row, to.col)

    const move: Move = {
      from: fromPosition,
      to: toPosition,
      type: type,
      color: color
    }

    this.bitboard.makeMove(move)

    this.turn = color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE
    this.fen = this.bitboard.generateFENFromBitBoard()
    this.checkmate = this.bitboard.getCheckmate()
    this.previousMove = {from, to}
  }

  getPossibleMovesForAPiece(piecesPos: Position, type: PieceType, color: PieceColor): ValidMoves {
    const position = this.positionToBitBoardIndex(piecesPos.row, piecesPos.col)
    return this.bitboard.getValidSquaresForFrontend(position, type, color)
  }
  
  getFen(): string {
    return this.fen
  }

  getTurn(): PieceColor {
    return this.turn
  }

  getCheckmate(): PieceColor | null {
    return this.checkmate
  }

  getPreviousMove(): PreviousMove | null {
    return this.previousMove
  }
}