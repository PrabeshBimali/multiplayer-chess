import { PieceColor, PieceType } from "@/app/types/global.enums"

export type Move = {
  from: number,
  to: number,
  type: PieceType,
  color: PieceColor
}

export type ValidMoves = {
  normalMoves: Array<number>,
  captureMoves: Array<number>
}