import { PieceColor, PieceType } from "../types/global.enums";
import { Position } from "../types/global.types";
import BitBoard from "./BitBoard";

export default class Game {
  private turn: PieceColor = PieceColor.WHITE
  private fen: string
  private bitboard: BitBoard = new BitBoard()

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

    this.bitboard.makeMove(fromPosition, toPosition, type, color)

    this.turn = color === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE
    this.fen = this.bitboard.generateFENFromBitBoard()
  }
  
  getFen(): string {
    return this.fen
  }

  getTurn(): PieceColor {
    return this.turn
  }
}