import { Payload } from "./payload.js";

export enum ChessPieceType {
    KING = '♔',
    QUEEN = '♕',
    ROOK = '♖',
    BISHOP = '♗',
    KNIGHT = '♘',
    PAWN = '♙',
}

export enum ChessColor {
    BLACK,
    WHITE,
}

class ChessPiece {
    constructor(readonly type: ChessPieceType, readonly color: ChessColor) { }

    static fromStr(repr: string): ChessPiece | undefined {
        if (repr.length != 2) return undefined;
        let color;
        switch (repr[0]) {
            case 'b': color = ChessColor.BLACK; break;
            case 'w': color = ChessColor.WHITE; break;
            default: throw Error('malformed chess piece color');
        }

        let type: ChessPieceType;
        switch (repr[1]) {
            case 'K': type = ChessPieceType.KING; break;
            case 'Q': type = ChessPieceType.QUEEN; break;
            case 'R': type = ChessPieceType.ROOK; break;
            case 'B': type = ChessPieceType.BISHOP; break;
            case 'N': type = ChessPieceType.KNIGHT; break;
            case 'P': type = ChessPieceType.PAWN; break;
            default: throw Error('malformed chess piece type');
        }
        return new ChessPiece(type, color);
    }

    static random(): ChessPiece {
        const color = Math.random() < 0.5 ? ChessColor.BLACK : ChessColor.WHITE;
        let type;
        switch (Math.floor(Math.random() * 6)) {
            case 0: type = ChessPieceType.KING; break;
            case 1: type = ChessPieceType.QUEEN; break;
            case 2: type = ChessPieceType.ROOK; break;
            case 3: type = ChessPieceType.BISHOP; break;
            case 4: type = ChessPieceType.KNIGHT; break;
            case 5: default: type = ChessPieceType.PAWN; break;
        }
        return new ChessPiece(type, color);
    }
}


export class ChessPayloadValue {
    readonly board: (ChessPiece | undefined)[][];
    readonly dims: [number, number];

    constructor(w: number, h: number) {
        this.dims = [w, h];
        this.board = [];
        for (let columnIdx = 0; columnIdx < w; ++columnIdx) {
            const column = [];
            for (let rowIdx = 0; rowIdx < h; ++rowIdx) {
                column.push(ChessPiece.random());
            }
            this.board.push(column);
        }
    }

    static make() {
        
    }
}

export interface ChessPayload extends Payload<ChessPayloadValue> {
    readonly type: 'CHESS';
}