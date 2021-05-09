import { Payload } from "./payload.js";

export enum ChessPiece {
    EMPTY,
    KING,
}


export class ChessPayloadValue {
    readonly board: ChessPiece[][];

    constructor(w: number, h: number) {
        this.board = [];
        for (let columnIdx = 0; columnIdx < w; ++columnIdx) {
            const column = [];
            for (let rowIdx = 0; rowIdx < h; ++rowIdx) {
                column.push(ChessPiece.EMPTY);
            }
            this.board.push(column);
        }
    }
}

export interface ChessPayload extends Payload<ChessPayloadValue> {
    readonly type: 'CHESS';
}