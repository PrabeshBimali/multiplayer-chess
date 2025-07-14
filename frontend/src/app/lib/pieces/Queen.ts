import { PieceType, PieceColor } from "@/app/types/global.enums";
import { Piece } from "@/app/types/global.interfaces";
import { FrontendBoard, Position } from "@/app/types/global.types";
import { isPositionOutOfBound } from "./pieces.helpers";

export default class Queen implements Piece {
  private type: PieceType
  private color: PieceColor

  constructor(color: PieceColor) {
    this.type = PieceType.QUEEN
    this.color = color
  }

  getColor(): PieceColor {
    return this.color
  }

  getType(): PieceType {
    return this.type
  }

  private collectMoves(pos: Position, board: FrontendBoard, directions: Array<Position>, capturesOnly: boolean): Array<Position> {
    const moves: Position[] = [];

    for (const d of directions) {
      let r = pos.row + d.row;
      let c = pos.col + d.col;

      while (!isPositionOutOfBound({row: r, col: c})) {
        const target = board[r][c];

        if (target === null) {
          if (!capturesOnly) moves.push({ row: r, col: c });
        } else {
          if (target.getColor() !== this.color) {
            moves.push({ row: r, col: c });
          }
          break;
        }

        r += d.row;
        c += d.col;
      }
    }

    return moves;
  }

  private getLinearMoves(pos: Position, board: FrontendBoard, capturesOnly: boolean): Array<Position> {
    const directions: Array<Position> = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 },  // right
    ];

    return this.collectMoves(pos, board, directions, capturesOnly);
  }

  private getDiagonalMoves(pos: Position, board: FrontendBoard, capturesOnly: boolean): Array<Position> {
    const directions: Array<Position> = [
      { row: -1, col: -1 }, // up-left
      { row: -1, col: 1 },  // up-right
      { row: 1, col: -1 },  // down-left
      { row: 1, col: 1 },   // down-right
    ];

    return this.collectMoves(pos, board, directions, capturesOnly);
  }

  getValidMoves(pos: Position, board: FrontendBoard): Array<Position> {
    return [
      ...this.getDiagonalMoves(pos, board, false),
      ...this.getLinearMoves(pos, board, false)
    ]
  }
  
  getCaptureMoves(pos: Position, board: FrontendBoard): Array<Position> {
    return [
      ...this.getDiagonalMoves(pos, board, true),
      ...this.getLinearMoves(pos, board, true)
    ]
  }
}