import { Piece } from "../types/global.interfaces"
import { PieceColor } from "../types/global.enums"
import { fenCharToPiece } from "./factories"
import { FrontendBoard } from "../types/global.types"

export default class Board {
  private board: FrontendBoard = []
  private fen: string

  constructor() {
    this.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    this.createInitialBoardState()
  }

  private createInitialBoardState(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.converFENToBoardState(this.fen)
  }

  private createPieceFromFENChar(char: string): Piece {
    const isUpper: boolean = char === char.toUpperCase();
    const color: PieceColor = isUpper ? PieceColor.WHITE : PieceColor.BLACK;
    const typeChar: string = char.toLowerCase()

    const pieceFactory: (color: PieceColor) => Piece = fenCharToPiece[typeChar]

    if(!pieceFactory) throw new Error(`'${char}' is Inavlid FEN character`);

    return pieceFactory(color)
  }

  converFENToBoardState(fen: string) {
    try {
      let currentRow: number = 0;
      //const board: Array<Array<Piece|null>> = []

      for (const row of fen.split("/")) {
        let currentCol: number = 0;

        for(const char of row) {

          const emptySquares: number = Number(char)

          if(!emptySquares) {
            
            this.board[currentRow][currentCol] = this.createPieceFromFENChar(char)
            currentCol++

          } else {

            let count: number = 0
            while(count < emptySquares) {
              this.board[currentRow][currentCol] = null
              count++
              currentCol++
            }

          }
        }

        currentRow++

      }

    } catch(e) {
      console.error(e)
      return
    }
  }

  getBoard(): Array<Array<Piece|null>> {
    return this.board
  }
}