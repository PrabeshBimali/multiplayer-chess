
import { PieceType, PieceColor } from "@/app/types/global.enums";
import { Piece } from "@/app/types/global.interfaces";
import { FrontendBoard, Position } from "@/app/types/global.types";
import { isPositionOutOfBound } from "./pieces.helpers";

export default class Knight implements Piece {
  private type: PieceType
  private color: PieceColor

  constructor(color: PieceColor) {
    this.type = PieceType.KNIGHT
    this.color = color
  }

  getColor(): PieceColor {
    return this.color
  }

  getType(): PieceType {
    return this.type
  }

  private getKnightMoves(pos: Position, board: FrontendBoard, capturesOnly: boolean): Array<Position> {
    const directions = [
      { dRow: 2, dCol: 1 },
      { dRow: 2, dCol: -1 },
      { dRow: -2, dCol: 1 },
      { dRow: -2, dCol: -1 },
      { dRow: 1, dCol: 2 },
      { dRow: -1, dCol: 2 },
      { dRow: -1, dCol: -2 },
      { dRow: 1, dCol: -2 },
    ]

    const moves: Array<Position> = []

    for (const {dRow, dCol} of directions) {
      const r = dRow + pos.row
      const c = dCol + pos.col

      if(!isPositionOutOfBound({row: r, col: c})) {

        const target = board[r][c]

        if(target === null) {

          if (!capturesOnly) moves.push({row: r, col: c})

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
    return this.getKnightMoves(pos, board, false);
  }
  
  getCaptureMoves(pos: Position, board: FrontendBoard): Array<Position> {
    return this.getKnightMoves(pos, board, true)
  }
}