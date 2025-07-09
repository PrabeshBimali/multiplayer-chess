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