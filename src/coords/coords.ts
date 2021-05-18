export const VWIDTH = 2000;
export const VHEIGHT = 3000;

export type CoordType =
    // SCREEN is the actual screen px coordinates
    // [0,0] top left to some runtime determined [w,h] bottom right of the viewport.
    'SCREEN' |

    // A virtual space of a fixed bounded 2:3 aspect ratio
    // The universe is [0, 0] to [2000, 3000], with anything outside of that being
    // outside the 'reachable' universe.
    'VIRTUAL';

// Note: almost everything is in virtual space so it gets the classes Pos and Vec.
// Screen space gets SPos and SVec
// Both are tagged specializations of PosBase and VecBase.

type untypedVec2 = [number, number];

export interface PosBase {
    readonly x: number;
    readonly y: number;
    readonly type: CoordType;
}

export interface PositionsBase {
    readonly pts: untypedVec2[];
    readonly type: CoordType;
}

export function delta(a: Pos, b: Pos): Vec {
    return new Vec(
        a.x - b.x,
        a.y - b.y);
}

export function add(a: Pos, b: Vec): Pos {
    return new Pos(
        a.x + b.dx,
        a.y + b.dy);
}

export class Vec {
    constructor(readonly dx: number, readonly dy: number) { }

    length() {
        return Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    }

    normalize(newLen: number): Vec {
        const len = this.length();
        if (len === 0) return this;
        const mult = newLen / len;
        return new Vec(this.dx * mult, this.dy * mult)
    }

    normalizeIfLongerThan(newLen: number): Vec {
        if (this.length() > newLen) return this.normalize(newLen);
        return this;
    }
}

export class SPos implements PosBase {
    readonly type = 'SCREEN';
    constructor(readonly x: number, readonly y: number) { }
}
export class Pos implements PosBase {
    readonly type = 'VIRTUAL';
    constructor(readonly x: number, readonly y: number) { }

    isInBounds(): boolean {
        const x = this.x;
        const y = this.y;
        return x >= 0 && y >= 0 && x <= VWIDTH && y <= VHEIGHT;
    }
}
export class SPositions implements PositionsBase {
    readonly type = 'SCREEN';
    constructor(readonly pts: untypedVec2[]) { }
}
export class Positions implements PositionsBase {
    readonly type = 'VIRTUAL';
    constructor(readonly pts: untypedVec2[]) { }
}
