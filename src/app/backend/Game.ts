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

  moveWhitePiece(piece: PieceType, from: Position, to: Position) {
    if(this.turn !== PieceColor.WHITE) {
      throw new Error("Not White Turn")
    }

    const fromPosition: number = this.positionToBitBoardIndex(from.row, from.col)
    const toPosition: number = this.positionToBitBoardIndex(to.row, to.col)

    switch(piece) {
      case PieceType.PAWN:
        this.bitboard.moveWhitePawn(fromPosition, toPosition)
    } 
    this.turn = PieceColor.BLACK
    this.fen = this.bitboard.generateFENFromBitBoard()
  }
  
  moveBlackPiece(piece: PieceType, from: Position, to: Position) {
    if(this.turn !== PieceColor.BLACK) {
      throw new Error("Not Black Turn")
    }

    const fromPosition: number = this.positionToBitBoardIndex(from.row, from.col)
    const toPosition: number = this.positionToBitBoardIndex(to.row, to.col)

    switch(piece) {
      case PieceType.PAWN:
        this.bitboard.moveBlackPawn(fromPosition, toPosition)
    } 
    this.turn = PieceColor.WHITE
    this.fen = this.bitboard.generateFENFromBitBoard()
  }

  getFen(): string {
    return this.fen
  }

  getTurn(): PieceColor {
    return this.turn
  }
}