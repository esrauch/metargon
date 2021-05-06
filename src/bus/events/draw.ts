import { Gfx } from "../../gfx/gfx.js";

// Requests anything interested to draw themselves.
export class DrawEvent {
    readonly type = 'DRAW'
    constructor(readonly gfx: Gfx) {}
}