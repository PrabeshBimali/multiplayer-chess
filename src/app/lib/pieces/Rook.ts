import { PieceType, PieceColor } from "@/app/types/global.enums";
import { Piece } from "@/app/types/global.interfaces";
import { FrontendBoard, Position } from "@/app/types/global.types";
import { isPositionOutOfBound } from "./pieces.helpers";

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

  private getLinearMoves(pos: Position, board: FrontendBoard, capturesOnly: boolean): Position[] {
    const directions = [
      { dRow: -1, dCol: 0 }, // up
      { dRow: 1, dCol: 0 },  // down
      { dRow: 0, dCol: -1 }, // left
      { dRow: 0, dCol: 1 }   // right
    ];

    const moves: Position[] = [];

    for (const { dRow, dCol } of directions) {
      let r = pos.row + dRow;
      let c = pos.col + dCol;

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

        r += dRow;
        c += dCol;
      }
    }

    return moves;
  }

  getValidMoves(pos: Position, board: FrontendBoard): Array<Position> {
    const validMoves: Array<Position> = this.getLinearMoves(pos, board, false)
    return validMoves
  }
  
  getCaptureMoves(pos: Position, board: FrontendBoard): Array<Position> {
    const captureMoves: Array<Position> = this.getLinearMoves(pos, board, true)
    return captureMoves
  }
}