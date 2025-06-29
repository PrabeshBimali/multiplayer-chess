import { PieceType, PieceColor } from "@/app/types/global.enums";
import { Piece } from "@/app/types/global.interfaces";
import { Position } from "@/app/types/global.types";

export default class Rook implements Piece {
  private type: PieceType
  private color: PieceColor

  constructor(color: PieceColor) {
    this.type = PieceType.ROOK
    this.color = color
  }

  getColor(): PieceColor {
    return this.color
  }

  getType(): PieceType {
    return this.type
  }

  getValidMoves(): Array<Position> {
    const validMoves: Array<Position> = []

    return validMoves
  }
}