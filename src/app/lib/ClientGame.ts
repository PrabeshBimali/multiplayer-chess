import Game from "../backend/Game";
import { PieceColor, PieceType } from "../types/global.enums";
import { FrontendBoard, Position } from "../types/global.types";
import Board from "./Board";

export default class ClientGame {
  private backendGame: Game = new  Game()
  private turn: PieceColor = this.backendGame.getTurn()
  private fen: string = this.backendGame.getFen()
  private checkmate: PieceColor | null = this.backendGame.getCheckmate()
  private board: Board = new Board(this.fen)

  moveAPiece(from: Position, to: Position, type: PieceType, color: PieceColor) {
    try {
      this.backendGame.moveAPiece(from, to, type, color)
      this.fen = this.backendGame.getFen()
      this.turn = this.backendGame.getTurn()
      this.checkmate = this.backendGame.getCheckmate()
      this.board.converFENToBoardState(this.fen)
    } catch(e) {
      console.error(e)
      return
    }
  }

  private bitboardIndexToPosition(index: number): Position {
    const row = (7 - Math.floor(index/8))
    const col = (7 - (index%8))
    return { row, col }
  }

  getPossibleMovesForAPiece(piecePos: Position, type: PieceType, color: PieceColor): Array<Position> {
    const validMovesIndexes = this.backendGame.getPossibleMovesForAPiece(piecePos, type, color)
    const validMoves = []
    for (const i of validMovesIndexes) {
      const pos = this.bitboardIndexToPosition(i)
      validMoves.push(pos)
    }

    return validMoves
  }

  getBoard(): FrontendBoard {
    return this.board.getBoard()
  }

  getTurn(): PieceColor {
    return this.turn
  }

  getCheckmate(): PieceColor | null {
    return this.checkmate
  }
}