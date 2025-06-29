import { Position } from "@/app/types/global.types";
import { PieceColor, PieceType } from "./global.enums";

export interface Piece {
  getColor: () => PieceColor,
  getType: () => PieceType,
  getValidMoves: () => Array<Position>
}