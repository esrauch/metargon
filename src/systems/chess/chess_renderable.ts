import { linearInterp } from "../../util/interp.js";
import { Pos, Positions, VWIDTH } from "../../coords/coords.js";
import { COLOR, Gfx } from "../../gfx/gfx.js";
import { ChessColor, ChessPayload } from "../../payloads/chess_payload.js";
import { Id } from "../../payloads/entity_id.js";
import { CustomRenderable } from "../../payloads/rendering_payload.js";
import { genericPayloadTable } from "../generic_payload_table.js";

export class ChessRenderable implements CustomRenderable {
    draw(gfx: Gfx, id: Id, center: Pos) {
        const chessPayload = genericPayloadTable.getPayload('CHESS', id);
        if (!chessPayload) {
            console.error('ChessRenderable with no corresponding payload')
            return;
        }
        const value = chessPayload.payload;
        const board = value.board;

        const w = VWIDTH * 2 / 3;
        const h = w;

        const T = center.y - h / 2;
        const R = center.x + w / 2;
        const B = center.y + h / 2;
        const L = center.x - w / 2;

        const TL = new Pos(L, T);
        const TR = new Pos(R, T);
        const BR = new Pos(R, B);
        const BL = new Pos(L, B);

        for (let i = 0; i < value.dims[0]; ++i)
            for (let j = 0; j < value.dims[1]; ++j) {
                const square = board[i][j];
                this.fillSquare(gfx, T, R, B, L, i, j, value);
            }

        gfx.line(TL, TR);
        gfx.line(TR, BR);
        gfx.line(BR, BL);
        gfx.line(BL, TL);
    }

    private fillSquare(
        gfx: Gfx,
        boardT: number,
        boardR: number,
        boardB: number,
        boardL: number,
        i: number,
        j: number,
        boardValue: ChessPayload) {
        const isDarkSquare = (i + j) % 2 == 1;
        const boardSquaresW = boardValue.dims[0];
        const boardSquaresH = boardValue.dims[1];
        const w = (boardR - boardL) / boardSquaresW;
        const h = (boardR - boardL) / boardSquaresH;
        const centerX = linearInterp(boardL, boardR, i / boardSquaresW) + w / 2;
        const centerY = linearInterp(boardT, boardB, j / boardSquaresH) + h / 2;
        const center = new Pos(centerX, centerY);
        if (!isDarkSquare) {
            gfx.fillrect(center, w, h, COLOR.BG_MILD);
        }
        const piece = boardValue.board[i][j];
        if (piece) {
            const color = piece.color == ChessColor.BLACK ? COLOR.FIRE : COLOR.FG;
            gfx.text(center, piece.type, { size: w, color: color });
        }
    }
}