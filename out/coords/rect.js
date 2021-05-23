import { Pos } from "./coords.js";
export class PositionedRect {
    constructor(center, w, h) {
        this.center = center;
        this.w = w;
        this.h = h;
    }
    static trbl(t, r, b, l) {
        if (r <= l)
            throw new Error('Rect must be r<=l');
        if (b <= t)
            throw new Error('Rect must be b<=t');
        const w = r - l;
        const h = b - t;
        const center = new Pos(l + w / 2, t + h / 2);
        return new PositionedRect(center, w, h);
    }
    get t() { return this.center.y - this.h / 2; }
    get r() { return this.center.x + this.w / 2; }
    get b() { return this.center.y + this.h / 2; }
    get l() { return this.center.x - this.w / 2; }
    get unpositionedRect() {
        return new Rect(this.w, this.h);
    }
    contains(test) {
        return this.l <= test.x && test.x <= this.r &&
            this.t <= test.y && test.y <= this.b;
    }
}
export class Rect {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
}
