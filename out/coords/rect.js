import { Pos } from "./coords.js";
export class PositionedRect {
    constructor(center, w, h) {
        this.center = center;
        this.w = w;
        this.h = h;
    }
    static fromBounds(t, r, b, l) {
        const w = r - l;
        const h = b - t;
        const center = new Pos(l + w / 2, t + h / 2);
        return new PositionedRect(center, w, h);
    }
}
export class Rect {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
}
