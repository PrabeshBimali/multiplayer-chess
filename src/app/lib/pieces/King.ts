
import { PieceType, PieceColor } from "@/app/types/global.enums";
import { Piece } from "@/app/types/global.interfaces";
import { FrontendBoard, Position } from "@/app/types/global.types";
import { isPositionOutOfBound } from "./pieces.helpers";

export default class king implements Piece {
  private type: PieceType
  private color: PieceColor

  constructor(color: PieceColor) {
    this.type = PieceType.KING
    this.color = color
  }

  getColor(): PieceColor {
    return this.color
  }

  getType(): PieceType {
    return this.type
  }

  private getKingMoves(pos: Position, board: FrontendBoard, capturesOnly: boolean): Array<Position> {
    const directions = [
      { dRow: 0, dCol: -1 },
      { dRow: 0, dCol: 1 },
      { dRow: 1, dCol: 0 },
      { dRow: 1, dCol: -1 },
      { dRow: 1, dCol: 1 },
      { dRow: -1, dCol: 0 },
      { dRow: -1, dCol: -1 },
      { dRow: -1, dCol: 1 },
    ]

    const moves: Array<Position> = []

    for (const { dRow, dCol } of directions) {
      const r = pos.row + dRow
      const c = pos.col + dCol

      if(!isPositionOutOfBound({row: r, col: c})) {
        const target: Piece | null = board[r][c]

        if(target === null) {
          if(!capturesOnly) moves.push({row: r, col: c})
        } else {
          if(target.getColor() !== this.color) {
            moves.push({row: r, col: c})
          }
        }

      }
    }

    return moves
  }

  getValidMoves(pos: Position, board: FrontendBoard): Array<Position> {
    return this.getKingMoves(pos, board, false)
  }

  getCaptureMoves(pos: Position, board: FrontendBoard): Array<Position> {
    return this.getKingMoves(pos, board, true)
  }
}