import Game from "../backend/Game";
import { PieceColor, PieceType } from "../types/global.enums";
import { FrontendBoard, Position } from "../types/global.types";
import Board from "./Board";

export default class ClientGame {
  private backendGame: Game = new  Game()
  private turn: PieceColor = this.backendGame.getTurn()
  private fen: string = this.backendGame.getFen()
  private board: Board = new Board(this.fen)

  moveAPiece(piece: PieceType, from: Position, to: Position) {
    try {
      if(this.turn === PieceColor.WHITE) {

        this.backendGame.moveWhitePiece(piece, from, to)

      } else if(this.turn === PieceColor.BLACK) {

        this.backendGame.moveBlackPiece(piece, from, to)

      }
      this.fen = this.backendGame.getFen()
      this.turn = this.backendGame.getTurn()
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
}