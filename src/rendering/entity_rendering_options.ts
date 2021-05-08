import { Vec } from "../coords/coords.js";
import { Gfx } from "../gfx/gfx.js";

export type Primitive =
    {
        readonly type: 'CIRCLE',
        readonly radius: number,
    } |
    {
        readonly type: 'LINE',
        readonly vec: Vec,
    } |
    {
        readonly type: 'RECT',
        readonly width: number,
        readonly height: number,
    };

export interface CompoundRenderingOption {
    readonly type: 'COMPOUND';
    readonly prims: Primitive[];
}

export interface CustomRenderingOption {
    readonly type: 'CUSTOM';
    readonly fn: (gfx: Gfx) => void;
}

export type EntityRenderingOptions =
    Primitive |
    CompoundRenderingOption |
    CustomRenderingOption;