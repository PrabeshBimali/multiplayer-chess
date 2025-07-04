import { u64_and, u64_not, u64_or, u64_shl, u64_shr } from "./helpers/uInt64.operations"
import { BitboardIndex, indexToFENChar } from "./types/backend.enums"

export default class BitBoard {
  private piecesPosition: BigUint64Array = new BigUint64Array(12)

  constructor() {
    this.createNewBitBoard()
  }

  createNewBitBoard() {
    // Black Pieces Initial Position
    this.piecesPosition[BitboardIndex.BlackPawns] = 0x00FF000000000000n
    this.piecesPosition[BitboardIndex.BlackRooks] = 0x8100000000000000n
    this.piecesPosition[BitboardIndex.BlackKnights] = 0x4200000000000000n
    this.piecesPosition[BitboardIndex.BlackBishops] = 0x2400000000000000n
    this.piecesPosition[BitboardIndex.BlackQueen] = 0x1000000000000000n
    this.piecesPosition[BitboardIndex.BlackKing] = 0x0800000000000000n

    // White Pieces Initial Position
    this.piecesPosition[BitboardIndex.WhitePawns] = 0x000000000000FF00n
    this.piecesPosition[BitboardIndex.WhiteRooks] = 0x0000000000000081n
    this.piecesPosition[BitboardIndex.WhiteKnights] = 0x0000000000000042n
    this.piecesPosition[BitboardIndex.WhiteBishops] = 0x0000000000000024n
    this.piecesPosition[BitboardIndex.WhiteQueen] = 0x0000000000000010n
    this.piecesPosition[BitboardIndex.WhiteKing] = 0x0000000000000008n
  }

  occupiedSquares(): bigint {
    let occupiedSquares: bigint = 0x0n
    for(const val of this.piecesPosition) {
      occupiedSquares = u64_or(occupiedSquares, val)
    }

    return occupiedSquares
  }

  emptySquares(): bigint {
    let emptySquares: bigint = u64_not(this.occupiedSquares())
    return emptySquares
  }

  blackOccupiedSquares(): bigint {
    return u64_or(this.piecesPosition[BitboardIndex.BlackPawns], this.piecesPosition[BitboardIndex.BlackRooks],
            this.piecesPosition[BitboardIndex.BlackKnights], this.piecesPosition[BitboardIndex.BlackBishops],
              this.piecesPosition[BitboardIndex.BlackQueen], this.piecesPosition[BitboardIndex.BlackKing])
  }
  
  whiteOccupiedSquares(): bigint {
    return u64_or(this.piecesPosition[BitboardIndex.WhitePawns], this.piecesPosition[BitboardIndex.WhiteRooks],
            this.piecesPosition[BitboardIndex.WhiteKnights], this.piecesPosition[BitboardIndex.WhiteBishops],
              this.piecesPosition[BitboardIndex.WhiteQueen], this.piecesPosition[BitboardIndex.WhiteKing])
  }

  private removeBlackPiece(square: number): void {
    const mask: bigint = u64_shl(1n, BigInt(square))

    if (u64_and(this.piecesPosition[BitboardIndex.BlackPawns], mask)) {
      this.piecesPosition[BitboardIndex.BlackPawns] = u64_and(this.piecesPosition[BitboardIndex.BlackPawns], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.BlackRooks], mask)) {
      this.piecesPosition[BitboardIndex.BlackRooks] = u64_and(this.piecesPosition[BitboardIndex.BlackRooks], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.BlackKnights], mask)) {
      this.piecesPosition[BitboardIndex.BlackKnights] = u64_and(this.piecesPosition[BitboardIndex.BlackKnights], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.BlackBishops], mask)) {
      this.piecesPosition[BitboardIndex.BlackBishops] = u64_and(this.piecesPosition[BitboardIndex.BlackBishops], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.BlackQueen], mask)) {
      this.piecesPosition[BitboardIndex.BlackQueen] = u64_and(this.piecesPosition[BitboardIndex.BlackQueen], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.BlackKing], mask)) {
      this.piecesPosition[BitboardIndex.BlackKing] = u64_and(this.piecesPosition[BitboardIndex.BlackKing], u64_not(mask));
    }
  }
  
  private removeWhitePiece(square: number): void {
    const mask: bigint = u64_shl(1n, BigInt(square))

    if (u64_and(this.piecesPosition[BitboardIndex.WhitePawns], mask)) {
      this.piecesPosition[BitboardIndex.WhitePawns] = u64_and(this.piecesPosition[BitboardIndex.WhitePawns], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.WhiteRooks], mask)) {
      this.piecesPosition[BitboardIndex.WhiteRooks] = u64_and(this.piecesPosition[BitboardIndex.WhiteRooks], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.WhiteKnights], mask)) {
      this.piecesPosition[BitboardIndex.WhiteKnights] = u64_and(this.piecesPosition[BitboardIndex.WhiteKnights], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.WhiteBishops], mask)) {
      this.piecesPosition[BitboardIndex.WhiteBishops] = u64_and(this.piecesPosition[BitboardIndex.WhiteBishops], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.WhiteQueen], mask)) {
      this.piecesPosition[BitboardIndex.WhiteQueen] = u64_and(this.piecesPosition[BitboardIndex.WhiteQueen], u64_not(mask));
    }
    else if (u64_and(this.piecesPosition[BitboardIndex.WhiteKing], mask)) {
      this.piecesPosition[BitboardIndex.WhiteKing] = u64_and(this.piecesPosition[BitboardIndex.WhiteKing], u64_not(mask));
    }
  }

  generateFENFromBitBoard(): string {
    const bbToString: Array<string | null> = new Array<string|null>(64).fill(null)
    let fen: string = "" 

    for(let i = 0; i < 12; i++) {
      let mask: bigint = this.piecesPosition[i]
      let index: number = 63;

      while(mask !== 0n) {
        if(u64_and(mask, 1n) === 1n) {
          bbToString[index] = indexToFENChar[i as BitboardIndex]
        }

        mask = u64_shr(mask, 1n)
        index--
      }
    }

    for(let rank = 0; rank < 8; rank++) {
      let empty: number = 0
      for(let file = 0; file < 8; file++) {
        const index: number = rank * 8 + file
        if(bbToString[index] !== null) {
          if(empty > 0) {
            fen += empty
          }
          fen += bbToString[index]
          empty = 0
        } else {
          empty++
        }

        if(file === 7 && empty > 0) {
          fen+=empty
        } 
      }
      // Do not add "/" for last row
      if(rank !== 7) {
        fen += "/"
      }
    }
    return fen
  }

  moveWhitePawn(from: number, to: number) {
    const fromMask: bigint = u64_shl(1n, BigInt(from));
    const toMask: bigint = u64_shl(1n, BigInt(to));
    const emptySquares: bigint = this.emptySquares()
    let whitePawns: bigint = this.piecesPosition[BitboardIndex.WhitePawns]
    const blackPieces: bigint = this.blackOccupiedSquares()
    
    if (u64_and(whitePawns, fromMask) === 0n) {
      throw new Error("No white pawn at source square");
    }

    const rank2 = 0x000000000000FF00n;
    const notHFile = 0xfefefefefefefefen;
    const notAFile = 0x7f7f7f7f7f7f7f7fn;

    const singlePush = u64_and(u64_shl(fromMask, 8n), emptySquares) === toMask;
    const doublePush =
      u64_and(fromMask, rank2) !== 0n &&
      u64_and(u64_shl(fromMask, 8n), emptySquares) !== 0n &&
      u64_and(u64_shl(fromMask, 16n), emptySquares) !== 0n &&
      u64_shl(fromMask, 16n) === toMask;

    const captureLeft = u64_shl(u64_and(fromMask, notAFile), 9n) === toMask && u64_and(blackPieces, toMask) !== 0n;
    const captureRight = u64_shl(u64_and(fromMask, notHFile), 7n) === toMask && u64_and(blackPieces, toMask) !== 0n;

    const isLegal = singlePush || doublePush || captureLeft || captureRight;
    if (!isLegal) throw new Error("Illegal move");

    // Move the pawn
    whitePawns = u64_and(whitePawns, u64_not(fromMask));
    whitePawns = u64_or(whitePawns, toMask);
    this.piecesPosition[BitboardIndex.WhitePawns] = whitePawns

    // If it’s a capture
    if (captureLeft || captureRight) {
      this.removeBlackPiece(to)
    }
  }

  moveBlackPawn(from: number, to: number) {
    const fromMask: bigint = u64_shl(1n, BigInt(from));
    const toMask: bigint = u64_shl(1n, BigInt(to));
    const emptySquares: bigint = this.emptySquares()
    let blackPawns: bigint = this.piecesPosition[BitboardIndex.BlackPawns]
    const whitePieces: bigint = this.whiteOccupiedSquares()

    if(u64_and(blackPawns, fromMask) === 0n) {
      throw new Error("No black Pawns at source square")
    }

    const rank7 = 0x00FF000000000000n
    const notAFile = 0x7F7F7F7F7F7F7F7Fn
    const notHFile = 0xFEFEFEFEFEFEFEFEn

    const singlePush = u64_and(u64_shr(fromMask, 8n), emptySquares) === toMask;

    const doublePush = 
                    u64_and(fromMask, rank7) !== 0n &&
                    u64_and(u64_shr(fromMask, 8n), emptySquares) !== 0n &&
                    u64_and(u64_shr(fromMask, 16n), emptySquares) !== 0n &&
                    u64_shr(fromMask, 16n) === toMask;

    const captureLeft = u64_shr(u64_and(fromMask, notAFile), 7n) === toMask && u64_and(whitePieces, toMask) !== 0n;
    const captureRight = u64_shr(u64_and(fromMask, notHFile), 9n) === toMask && u64_and(whitePieces, toMask) !== 0n;

    const isLegal = singlePush || doublePush || captureLeft || captureRight;
    if (!isLegal) throw new Error("Illegal move");

    // Move the pawn
    blackPawns = u64_and(blackPawns, u64_not(fromMask));
    blackPawns = u64_or(blackPawns, toMask);
    this.piecesPosition[BitboardIndex.BlackPawns] = blackPawns

    // If it’s a capture
    if (captureLeft || captureRight) {
      this.removeWhitePiece(to)
    }

  }
}
