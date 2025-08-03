import { FrontendBoard, Position, PreviousMove } from "@/app/types/global.types";
import { PieceColor, PieceType } from "./global.enums";

export interface Piece {
  getColor: () => PieceColor,
  getType: () => PieceType,
  getValidMoves: (piecePos: Position, board: FrontendBoard) => Array<Position>
  getCaptureMoves: (piecePos: Position, board: FrontendBoard) => Array<Position>
}

export interface MovePayload {
  from: Position
  to: Position
  playerid: string
  gameid: string
  color: PieceColor
  type: PieceType
}

export interface MoveResult {
  turn: PieceColor,
  fen: string,
  checkmate: PieceColor | null,
  previousMove: PreviousMove | null
}