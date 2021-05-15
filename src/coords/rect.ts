import { Pos } from "./coords.js";


export class PositionedRect {
    constructor(readonly center: Pos, readonly w: number, readonly h: number) {}

    static fromBounds(t: number, r: number, b: number, l: number): PositionedRect {
        const w = r - l;
        const h = b - t;
        const center = new Pos(l + w / 2, t + h /2);
        return new PositionedRect(center, w, h);
    }
}

export class Rect {
    constructor(readonly w: number, readonly h: number) {}
}