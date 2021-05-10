import { linearInterp } from "../../util/interp.js";
import { Pos, VWIDTH } from "../../coords/coords.js";
import { COLORS } from "../../gfx/gfx.js";
import { ChessColor } from "../../payloads/chess_payload.js";
import { genericPayloadTable } from "../generic_payload_table.js";
export class ChessRenderable {
    draw(gfx, id, center) {
        const chessPayload = genericPayloadTable.getPayload('CHESS', id);
        if (!chessPayload) {
            console.error('ChessRenderable with no corresponding payload');
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
    fillSquare(gfx, boardT, boardR, boardB, boardL, i, j, boardValue) {
        const isDarkSquare = (i + j) % 2 == 1;
        const boardSquaresW = boardValue.dims[0];
        const boardSquaresH = boardValue.dims[1];
        const w = (boardR - boardL) / boardSquaresW;
        const h = (boardR - boardL) / boardSquaresH;
        const centerX = linearInterp(boardL, boardR, i / boardSquaresW) + w / 2;
        const centerY = linearInterp(boardT, boardB, j / boardSquaresH) + h / 2;
        const center = new Pos(centerX, centerY);
        if (!isDarkSquare) {
            gfx.fillrect(center, w, h, COLORS.BG_MILD);
        }
        const piece = boardValue.board[i][j];
        if (piece) {
            const color = piece.color == ChessColor.BLACK ? COLORS.FIRE : COLORS.FG;
            gfx.text(center, piece.type, { size: w, color: color });
        }
    }
}
