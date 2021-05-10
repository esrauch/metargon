import { Pos } from "../coords/coords.js";


export function rectContains(
    rectCenter: Pos,
    rectW: number,
    rectH: number,
    test: Pos): boolean {
    const T = rectCenter.y - rectH / 2;
    const R = rectCenter.x + rectW / 2;
    const B = rectCenter.y + rectH / 2;
    const L = rectCenter.x - rectW / 2;

    return L <= test.x && test.x <= R &&
        T <= test.y && test.y <= B;

}