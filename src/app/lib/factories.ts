import { PieceColor } from "../types/global.enums";
import { Piece } from "../types/global.interfaces";
import Bishop from "./pieces/Bishop";
import king from "./pieces/King";
import Knight from "./pieces/Knight";
import Pawn from "./pieces/Pawn";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

type PieceFactory = (color: PieceColor) => Piece

export const fenCharToPiece: Record<string, PieceFactory> = {
  p: (color) => new Pawn(color),
  r: (color) => new Rook(color),
  b: (color) => new Bishop(color),
  n: (color) =>  new Knight(color),
  k: (color) => new king(color),
  q: (color) => new Queen(color)
}