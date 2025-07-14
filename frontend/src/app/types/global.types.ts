import { Piece } from "./global.interfaces"

export type SVGPieceProps = {
  size: number,
  color: string
}

export type Position = {
  row: number,
  col: number
}

export type ValidMovesFrontend = {
  normalMoves: Array<Position>,
  captureMoves: Array<Position>
}

export type PreviousMove = {
  from: Position,
  to: Position
}

export type FrontendBoard = Array<Array<Piece | null>>
