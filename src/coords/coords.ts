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

export interface VecBase {
    readonly dx: number;
    readonly dy: number;
    readonly type: CoordType;
}

export function delta(a: SPos, b: SPos): SVec;
export function delta(a: Pos, b: Pos): Vec;
export function delta<T extends PosBase>(a: T, b: T): VecBase {
    if (a.type !== b.type) throw new Error('subtract requires same-type positions');
    return {
        dx: a.x - b.x,
        dy: a.y - b.y,
        type: a.type
    };
}

export function add(a: SPos, b: SVec): SPos;
export function add(a: Pos, b: Vec): Pos;
export function add(a: PosBase, b: VecBase): PosBase {
    if (a.type !== b.type) throw new Error('add requires same-type positions and vec');
    return {
        x: a.x + b.dx,
        y: a.y + b.dy,
        type: a.type
    };
}

// Tagged enum classes.
export class SVec implements VecBase {
    readonly type = 'SCREEN';
    constructor(readonly dx: number, readonly dy: number) { }
}
export class Vec implements VecBase {
    readonly type = 'VIRTUAL';
    constructor(readonly dx: number, readonly dy: number) { }
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
