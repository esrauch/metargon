// Requests anything interested to draw themselves.
export class Draw {
    constructor(gfx) {
        this.gfx = gfx;
        this.type = 'DRAW';
    }
}
