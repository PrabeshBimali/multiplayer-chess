import { PieceType, PieceColor } from "@/app/types/global.enums";
import { Piece } from "@/app/types/global.interfaces";
import { FrontendBoard, Position } from "@/app/types/global.types";
import { doesPossitionContainPiece, isPositionOutOfBound } from "./pieces.helpers";

export default class Pawn implements Piece {
  private type: PieceType
  private color: PieceColor

  constructor(color: PieceColor) {
    this.type = PieceType.PAWN
    this.color = color
  }

  getColor(): PieceColor {
    return this.color
  }

  getType(): PieceType {
    return this.type
  }

  getValidMoves(piecePos: Position, board: FrontendBoard): Array<Position> {
    const validMoves: Array<Position> = []
    const direction: number = this.color === PieceColor.WHITE ? -1 : 1

    let newPos: Position = {row: piecePos.row + direction, col: piecePos.col}
    
    if (!isPositionOutOfBound(newPos) && !doesPossitionContainPiece(newPos, board)) {
      validMoves.push(newPos)
    }

    newPos = {row: piecePos.row + (direction * 2), col: piecePos.col}

    if(!isPositionOutOfBound(newPos) && !doesPossitionContainPiece(newPos, board)) {
      if((this.color === PieceColor.BLACK && piecePos.row === 1) || (this.color === PieceColor.WHITE && piecePos.row === 6)) {
        validMoves.push(newPos)
      }
    }

    return validMoves
  }
  
  getCaptureMoves(pos: Position, board: FrontendBoard): Array<Position> {
     const captures: Position[] = [];
    const direction = this.color === PieceColor.WHITE ? -1 : 1;
    const { row, col } = pos;
    const nextRow = row + direction;

    for (const dCol of [-1, 1]) {
      const targetCol = col + dCol;
      if (!isPositionOutOfBound({row: nextRow, col: targetCol})) {
        const target = board[nextRow][targetCol];
        if (target && target.getColor() !== this.color) {
          captures.push({ row: nextRow, col: targetCol });
        }
      }
    }

    return captures;
  }
}