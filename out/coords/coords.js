export const VWIDTH = 2000;
export const VHEIGHT = 3000;
export function delta(a, b) {
    if (a.type !== b.type)
        throw new Error('subtract requires same-type positions');
    return {
        dx: a.x - b.x,
        dy: a.y - b.y,
        type: a.type
    };
}
export function add(a, b) {
    if (a.type !== b.type)
        throw new Error('add requires same-type positions and vec');
    return {
        x: a.x + b.dx,
        y: a.y + b.dy,
        type: a.type
    };
}
// Tagged enum classes.
export class SVec {
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
        this.type = 'SCREEN';
    }
}
export class Vec {
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
        this.type = 'VIRTUAL';
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
