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

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

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
    if (!isLegal) throw new Error("Illegal Pawn move");

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

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

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
    if (!isLegal) throw new Error("Illegal Pawn move");

    // Move the pawn
    blackPawns = u64_and(blackPawns, u64_not(fromMask));
    blackPawns = u64_or(blackPawns, toMask);
    this.piecesPosition[BitboardIndex.BlackPawns] = blackPawns

    // If it’s a capture
    if (captureLeft || captureRight) {
      this.removeWhitePiece(to)
    }
  }

  private generateRookMoves(from: number, occupied: bigint, friendly: bigint): bigint {
    const directions = [+1, -1, +8, -8]; // E, W, N, S
    let moves = 0n;

    for (const dir of directions) {
      let pos = from;

      while (true) {
        pos += dir;

        // Edge check
        if (pos < 0 || pos > 63) break;

        // File edge check (to prevent wraparound)
        if (dir === +1 && pos % 8 === 0) break; // wrapped from h to a
        if (dir === -1 && (pos + 1) % 8 === 0) break; // wrapped from a to h

        const mask = u64_shl(1n, BigInt(pos));

        if (u64_and(friendly, mask) !== 0n) break; // blocked by own piece
        moves |= mask;

        if (u64_and(occupied, mask) !== 0n) break; // blocked by enemy piece (capture allowed but stop)
      }
    }

    return moves;
  }

  moveWhiteRook(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let whiteRooks: bigint = this.piecesPosition[BitboardIndex.WhiteRooks]
    const occupied: bigint = this.occupiedSquares()
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a rook at `from`
    if (u64_and(whiteRooks, fromMask) === 0n) {
      throw new Error("No White Rook at source square");
    }

    // 2. Check if `to` is reachable
    const rookMoves = this.generateRookMoves(from, occupied, whitePieces);

    if (u64_and(rookMoves, toMask) === 0n) {
      throw new Error("Illegal Rook move");
    }

    // 3. If capturing, remove black piece from correct board
    if (u64_and(blackPieces, toMask) !== 0n) {
      this.removeBlackPiece(to);
    }

    // 4. Update rook position
    whiteRooks = u64_and(whiteRooks, u64_not(fromMask));
    whiteRooks = u64_or(whiteRooks, toMask);
    this.piecesPosition[BitboardIndex.WhiteRooks] = whiteRooks
  }
  
  moveBlackRook(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let blackRooks: bigint = this.piecesPosition[BitboardIndex.BlackRooks]
    const occupied: bigint = this.occupiedSquares()
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a rook at `from`
    if (u64_and(blackRooks, fromMask) === 0n) {
      throw new Error("No Black Rook at source square");
    }

    // 2. Check if `to` is reachable
    const rookMoves = this.generateRookMoves(from, occupied, blackPieces);

    if (u64_and(rookMoves, toMask) === 0n) {
      throw new Error("Illegal Rook move");
    }

    // 3. If capturing, remove white piece from correct board
    if (u64_and(whitePieces, toMask) !== 0n) {
      this.removeWhitePiece(to);
    }

    // 4. Update rook position
    blackRooks = u64_and(blackRooks, u64_not(fromMask));
    blackRooks = u64_or(blackRooks, toMask);
    this.piecesPosition[BitboardIndex.BlackRooks] = blackRooks
  }

  private wrapsAround(from: number, to: number):  boolean {
    const fromFile = from % 8;
    const toFile = to % 8;
    const diff = Math.abs(fromFile - toFile);

    // returns true when move is valid diagonal move
    return diff !== 1;
  }

  private generateBishopMoves(from: number, occupied: bigint, friendly: bigint): bigint {

    const directions = [+7, +9, -7, -9]; // NW, NE, SE, SW
    let moves = 0n;

    for (const dir of directions) {
      let pos = from;

      while (true) {
        const prev = pos
        pos += dir;

        // Stop if off-board
        if (pos < 0 || pos > 63) break;

        // Prevent wraparound at edges
        if (this.wrapsAround(prev, pos)) break;

        const mask = u64_shl(1n, BigInt(pos));

        if (u64_and(friendly, mask) !== 0n) break; // blocked by own piece
        moves |= mask;

        if (u64_and(occupied, mask) !== 0n) break; // blocked by enemy
      }
    }

    return moves;
  }

  moveWhiteBishop(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let whiteBishops: bigint = this.piecesPosition[BitboardIndex.WhiteBishops]
    const occupied: bigint = this.occupiedSquares()
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a Bishop at `from`
    if (u64_and(whiteBishops, fromMask) === 0n) {
      throw new Error("No White Bishop at source square");
    }

    // 2. Check if `to` is reachable
    const bishopMoves = this.generateBishopMoves(from, occupied, whitePieces);

    if (u64_and(bishopMoves, toMask) === 0n) {
      throw new Error("Illegal Bishop move");
    }

    // 3. If capturing, remove black piece from correct board
    if (u64_and(blackPieces, toMask) !== 0n) {
      this.removeBlackPiece(to);
    }

    // 4. Update Bishop position
    whiteBishops = u64_and(whiteBishops, u64_not(fromMask));
    whiteBishops = u64_or(whiteBishops, toMask);
    this.piecesPosition[BitboardIndex.WhiteBishops] = whiteBishops
  }
  
  moveBlackBishop(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let blackBishops: bigint = this.piecesPosition[BitboardIndex.BlackBishops]
    const occupied: bigint = this.occupiedSquares()
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a Bishop at `from`
    if (u64_and(blackBishops, fromMask) === 0n) {
      throw new Error("No White Bishop at source square");
    }

    // 2. Check if `to` is reachable
    const bishopMoves = this.generateBishopMoves(from, occupied, blackPieces);

    if (u64_and(bishopMoves, toMask) === 0n) {
      throw new Error("Illegal Bishop move");
    }

    // 3. If capturing, remove white piece from correct board
    if (u64_and(whitePieces, toMask) !== 0n) {
      this.removeWhitePiece(to);
    }

    // 4. Update Bishop position
    blackBishops = u64_and(blackBishops, u64_not(fromMask));
    blackBishops = u64_or(blackBishops, toMask);
    this.piecesPosition[BitboardIndex.BlackBishops] = blackBishops
  }

  private generateQueenMoves(from: number, occupied: bigint, friendly: bigint): bigint {
    const diagonalMoves = this.generateBishopMoves(from, occupied, friendly);
    const linearMoves = this.generateRookMoves(from, occupied, friendly)
    return u64_or(diagonalMoves, linearMoves)
  }
  
  moveWhiteQueen(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let whiteQueen: bigint = this.piecesPosition[BitboardIndex.WhiteQueen]
    const occupied: bigint = this.occupiedSquares()
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a Queen at `from`
    if (u64_and(whiteQueen, fromMask) === 0n) {
      throw new Error("No White Queen at source square");
    }

    // 2. Check if `to` is reachable
    const queenMoves = this.generateQueenMoves(from, occupied, whitePieces);

    if (u64_and(queenMoves, toMask) === 0n) {
      throw new Error("Illegal Queen move");
    }

    // 3. If capturing, remove black piece from correct board
    if (u64_and(blackPieces, toMask) !== 0n) {
      this.removeBlackPiece(to);
    }

    // 4. Update Queen position
    whiteQueen = u64_and(whiteQueen, u64_not(fromMask));
    whiteQueen = u64_or(whiteQueen, toMask);
    this.piecesPosition[BitboardIndex.WhiteQueen] = whiteQueen
  }
  
  moveBlackQueen(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let blackQueen: bigint = this.piecesPosition[BitboardIndex.BlackQueen]
    const occupied: bigint = this.occupiedSquares()
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a Queen at `from`
    if (u64_and(blackQueen, fromMask) === 0n) {
      throw new Error("No Black Queen at source square");
    }

    // 2. Check if `to` is reachable
    const queenMoves = this.generateQueenMoves(from, occupied, blackPieces);

    if (u64_and(queenMoves, toMask) === 0n) {
      throw new Error("Illegal Queen move");
    }

    // 3. If capturing, remove white piece from correct board
    if (u64_and(whitePieces, toMask) !== 0n) {
      this.removeWhitePiece(to);
    }

    // 4. Update Queen position
    blackQueen = u64_and(blackQueen, u64_not(fromMask));
    blackQueen = u64_or(blackQueen, toMask);
    this.piecesPosition[BitboardIndex.BlackQueen] = blackQueen
  }

  generateKnightMoves(from: number, friendly: bigint): bigint {
    const fromMask = u64_shl(1n, BigInt(from));

    const notHFile = 0xFEFEFEFEFEFEFEFEn;
    const notGHFile = 0xFCFCFCFCFCFCFCFCn;
    const notAFile = 0x7F7F7F7F7F7F7F7Fn;
    const notABFile = 0x3F3F3F3F3F3F3F3Fn;

    let moves = 0n;

    // ↑↑→ NNE
    if (u64_and(fromMask, notAFile) !== 0n) {
      moves = u64_or(moves, u64_shl(fromMask, 17n));
    }

    // ↑↑← NNW
    if (u64_and(fromMask, notHFile) !== 0n) {
      moves = u64_or(moves, u64_shl(fromMask, 15n));
    }

    // ↑→→ ENE
    if (u64_and(fromMask, notABFile) !== 0n) {
      moves = u64_or(moves, u64_shl(fromMask, 10n));
    }

    // ↑←← WNW
    if (u64_and(fromMask, notGHFile) !== 0n) {
      moves = u64_or(moves, u64_shl(fromMask, 6n));
    }

    // ↓→→ ESE
    if (u64_and(fromMask, notABFile) !== 0n) {
      moves = u64_or(moves, u64_shr(fromMask, 6n));
    }

    // ↓←← WSW
    if (u64_and(fromMask, notGHFile) !== 0n) {
      moves = u64_or(moves, u64_shr(fromMask, 10n));
    }

    // ↓↓→ SSE
    if (u64_and(fromMask & notAFile) !== 0n) {
      moves = u64_or(moves, u64_shr(fromMask, 15n));
    }

    // ↓↓← SSW
    if (u64_and(fromMask & notHFile) !== 0n) {
      moves = u64_or(moves, u64_shr(fromMask, 17n));
    }

    // Filter out friendly pieces
    moves &= ~friendly;
    console.log(moves)
    return moves;

  }

  moveWhiteKnight(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let whiteKnights: bigint = this.piecesPosition[BitboardIndex.WhiteKnights]
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a Knight at `from`
    if (u64_and(whiteKnights, fromMask) === 0n) {
      throw new Error("No White Knight at source square");
    }

    // 2. Check if `to` is reachable
    const knightMoves = this.generateKnightMoves(from, whitePieces);

    if (u64_and(knightMoves, toMask) === 0n) {
      throw new Error("Illegal Knight move");
    }

    // 3. If capturing, remove black piece from correct board
    if (u64_and(blackPieces, toMask) !== 0n) {
      this.removeBlackPiece(to);
    }

    // 4. Update Knight position
    whiteKnights = u64_and(whiteKnights, u64_not(fromMask));
    whiteKnights = u64_or(whiteKnights, toMask);
    this.piecesPosition[BitboardIndex.WhiteKnights] = whiteKnights
  }
  
  moveBlackKnight(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let blackKnights: bigint = this.piecesPosition[BitboardIndex.BlackKnights]
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a Knight at `from`
    if (u64_and(blackKnights, fromMask) === 0n) {
      throw new Error("No White Knight at source square");
    }

    // 2. Check if `to` is reachable
    const knightMoves = this.generateKnightMoves(from, blackPieces);

    if (u64_and(knightMoves, toMask) === 0n) {
      throw new Error("Illegal Knight move");
    }

    // 3. If capturing, remove black piece from correct board
    if (u64_and(whitePieces, toMask) !== 0n) {
      this.removeWhitePiece(to);
    }

    // 4. Update Knight position
    blackKnights = u64_and(blackKnights, u64_not(fromMask));
    blackKnights = u64_or(blackKnights, toMask);
    this.piecesPosition[BitboardIndex.BlackKnights] = blackKnights
  }

  private generateKingMoves(from: number, friendly: bigint): bigint {
    const notHFile = 0xFEFEFEFEFEFEFEFEn;
    const notAFile = 0x7F7F7F7F7F7F7F7Fn;

    const fromMask = u64_shl(1n, BigInt(from));
    let moves = 0n;

    // horizontal/vertical
    if (u64_and(fromMask, notHFile) !== 0n) {
      moves = u64_or(moves, u64_shr(fromMask, 1n));
    }

    if (u64_and(fromMask, notAFile) !== 0n) {
      moves = u64_or(moves, u64_shl(fromMask, 1n));
    }

    moves = u64_or(moves, u64_shr(fromMask, 8n));
    moves = u64_or(moves, u64_shl(fromMask, 8n));

    // diagonals
    if (u64_and(fromMask, notHFile) !== 0n) {
      moves = u64_or(moves, u64_shr(fromMask, 9n));
      moves = u64_or(moves, u64_shl(fromMask, 7n));
    }

    if (u64_and(fromMask, notAFile) !== 0n) {
      moves = u64_or(moves, u64_shl(fromMask, 9n));
      moves = u64_or(moves, u64_shr(fromMask, 7n));
    }

    // remove friendly collisions
    return u64_and(moves, u64_not(friendly));
  }

  moveWhiteKing(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let whiteKing: bigint = this.piecesPosition[BitboardIndex.WhiteKing]
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a King at `from`
    if (u64_and(whiteKing, fromMask) === 0n) {
      throw new Error("No White King at source square");
    }

    // 2. Check if `to` is reachable
    const kingMoves = this.generateKingMoves(from, whitePieces);

    if (u64_and(kingMoves, toMask) === 0n) {
      throw new Error("Illegal King move");
    }

    // 3. If capturing, remove black piece from correct board
    if (u64_and(blackPieces, toMask) !== 0n) {
      this.removeBlackPiece(to);
    }

    // 4. Update King position
    whiteKing = u64_and(whiteKing, u64_not(fromMask));
    whiteKing = u64_or(whiteKing, toMask);
    this.piecesPosition[BitboardIndex.WhiteKing] = whiteKing
  }
  
  moveBlackKing(from: number, to: number) {

    if(from === to) {
      throw new Error("Cannot move to same square")
    }
    
    if(to < 0 && to > 63) {
      throw new Error("Illegal Move")
    }

    const fromMask = u64_shl(1n, BigInt(from));
    const toMask = u64_shl(1n, BigInt(to));
    let blackKing: bigint = this.piecesPosition[BitboardIndex.BlackKing]
    const whitePieces: bigint = this.whiteOccupiedSquares()
    const blackPieces: bigint = this.blackOccupiedSquares()

    // 1. Check there's a King at `from`
    if (u64_and(blackKing, fromMask) === 0n) {
      throw new Error("No Black King at source square");
    }

    // 2. Check if `to` is reachable
    const kingMoves = this.generateKingMoves(from, blackPieces);

    if (u64_and(kingMoves, toMask) === 0n) {
      throw new Error("Illegal King move");
    }

    // 3. If capturing, remove black piece from correct board
    if (u64_and(whitePieces, toMask) !== 0n) {
      this.removeWhitePiece(to);
    }

    // 4. Update King position
    blackKing = u64_and(blackKing, u64_not(fromMask));
    blackKing = u64_or(blackKing, toMask);
    this.piecesPosition[BitboardIndex.BlackKing] = blackKing
  }

}
