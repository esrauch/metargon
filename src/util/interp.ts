import { Pos } from "../coords/coords.js";

export function linearInterp(from: number, to:number, amt: number) {
    return (to - from) * amt + from;
}

export function linearInterpPos(from: Pos, to:Pos, xAmt: number, yAmt ?: number): Pos {
    // If only one amt is provided then interp both the same.
    yAmt = yAmt === undefined ? xAmt : yAmt;
    return new Pos(
        linearInterp(from.x, to.x, xAmt),
        linearInterp(from.y, to.y, yAmt)
    );
}

export function easeInOutInterpPos(from: Pos, to: Pos, amt: number): Pos {
    return linearInterpPos(from, to, Math.sin(amt * Math.PI/2));
}