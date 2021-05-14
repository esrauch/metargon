import { ControlName } from "../controls/controls.js";
import { Vec, Positions, Pos } from "../coords/coords.js";
import { Gfx } from "../gfx/gfx.js";
import { Id } from "./entity_id.js";
import { TypedPayload } from "./payload.js";

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
    readonly fn: (gfx: Gfx, id: Id, center: Pos) => void;
}

export interface CustomRenderable {
    draw: (gfx: Gfx, id: Id, center: Pos) => void
}

export interface CustomObjRenderingOption {
    readonly type: 'CUSTOM',
    readonly obj: CustomRenderable,
}

export interface ControlButtonRenderingOption {
    readonly type: 'CONTROL_BUTTON',
    readonly controlName: ControlName,
    readonly w: number,
}

export type RenderingPayload = Primitive |
CompoundRenderingOption |
CustomFnRenderingOption |
CustomObjRenderingOption |
ControlButtonRenderingOption;
    

export interface RenderingTypedPayload extends TypedPayload<RenderingPayload> {
    readonly type: 'RENDERING';
}