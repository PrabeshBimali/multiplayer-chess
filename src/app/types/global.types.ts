import { Piece } from "./global.interfaces"

export type SVGPieceProps = {
  size: number,
  color: string
}

export type Position = {
  row: number,
  col: number
}

export type FrontendBoard = Array<Array<Piece | null>>