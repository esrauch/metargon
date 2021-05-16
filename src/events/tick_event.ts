import { Gfx } from "../gfx/gfx.js";


// Tick exposes solely the global opacity part of Gfx.
// Note that probably this should technically also be 'hidden' on the Gfx from the Draw event.
interface GfxExposedOnTick {
    setGlobalOpacity(opacity: number): void;
    forceForegroundColor(color?: string): void;
}

export class Tick {
    readonly type = 'TICK';

    constructor(readonly gfx: GfxExposedOnTick) {}
}