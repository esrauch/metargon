export const VWIDTH = 2000;
export const VHEIGHT = 3000;
export function delta(a, b) {
    return new Vec(a.x - b.x, a.y - b.y);
}
export function add(a, b) {
    return new Pos(a.x + b.dx, a.y + b.dy);
}
export class Vec {
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
    length() {
        return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    }
    mult(m) {
        if (m == 1)
            return this;
        return new Vec(this.dx * m, this.dy * m);
    }
    normalize(newLen) {
        const len = this.length();
        if (len === 0)
            return this;
        return this.mult(newLen / len);
    }
    normalizeIfLongerThan(newLen) {
        if (this.length() > newLen)
            return this.normalize(newLen);
        return this;
    }
}
export class SPos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = 'SCREEN';
    }
}
export class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = 'VIRTUAL';
    }
    isInBounds() {
        const x = this.x;
        const y = this.y;
        return x >= 0 && y >= 0 && x <= VWIDTH && y <= VHEIGHT;
    }
}
export function pos(x, y) {
    return new Pos(x, y);
}
export class SPositions {
    constructor(pts) {
        this.pts = pts;
        this.type = 'SCREEN';
    }
}
export class Positions {
    constructor(pts) {
        this.pts = pts;
        this.type = 'VIRTUAL';
    }
}
