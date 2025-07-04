import { FrontendBoard, Position } from "@/app/types/global.types";

export function isPositionOutOfBound(position: Position): boolean {
  if (position.row >= 8 || position.col >= 8 || position.row < 0 || position.col < 0) return true

  return false
}

export function doesPossitionContainPiece(position: Position, board: FrontendBoard): boolean {
  if(board[position.row][position.col] === null) return false

  return true
}