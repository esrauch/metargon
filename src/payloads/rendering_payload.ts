import { Vec, Positions, Pos } from "../coords/coords.js";
import { Gfx } from "../gfx/gfx.js";
import { Payload } from "./payload.js";

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
    } |
    {
        readonly type: 'LINELOOP',
        readonly pts: Positions,
    } |
    {
        readonly type: 'TEXT',
        readonly text: string,
        readonly color?: string,
        readonly size?: number,
        readonly font?: string,
    };

export interface CompoundRenderingOption {
    readonly type: 'COMPOUND';
    readonly prims: Primitive[];
}

export interface CustomFnRenderingOption {
    readonly type: 'FUNCTION';
    readonly fn: (gfx: Gfx, center: Pos) => void;
}

export interface CustomRenderable {
    draw: (gfx: Gfx, center: Pos) => void
}

export interface CustomObjRenderingOption {
    readonly type: 'CUSTOM',
    readonly obj: CustomRenderable,
}

export type RenderingPayloadValue = Primitive |
CompoundRenderingOption |
CustomFnRenderingOption |
CustomObjRenderingOption;

// Note: RenderingPayload is unusual in that it permits undefined, used to
// *stop* rendering something without destroying it.
export interface RenderingPayload extends Payload<RenderingPayloadValue|undefined> {
    readonly type: 'RENDERING';
}