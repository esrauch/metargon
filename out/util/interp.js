import { Pos } from "../coords/coords.js";
export function linearInterp(from, to, amt) {
    return (to - from) * amt + from;
}
export function linearInterpPos(from, to, xAmt, yAmt) {
    // If only one amt is provided then interp both the same.
    yAmt = yAmt === undefined ? xAmt : yAmt;
    return new Pos(linearInterp(from.x, to.x, xAmt), linearInterp(from.y, to.y, yAmt));
}
export function easeInOutInterpPos(from, to, amt) {
    return linearInterpPos(from, to, Math.sin(amt * Math.PI / 2));
}
