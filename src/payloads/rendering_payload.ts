import { Vec, Positions, Pos } from "../coords/coords.js";
import { Gfx } from "../gfx/gfx.js";
import { Id } from "./entity_id.js";
import { TypedPayload } from "./payload.js";

export enum Icon {
    SPIN = 'SPIN',
}

export type Primitive =
    {
        readonly type: 'CIRCLE',
        readonly radius: number,
        readonly color?: string,
    } |
    {
        readonly type: 'LINE',
        readonly vec: Vec,
        readonly color?: string,
    } |
    {
        readonly type: 'RECT',
        readonly width: number,
        readonly height: number,
        readonly color?: string,
        readonly filled?: boolean,
    } |
    {
        readonly type: 'LINELOOP',
        readonly pts: Positions,
        readonly color?: string,
    } |
    {
        readonly type: 'TEXT',
        readonly text: string,
        readonly color?: string,
        readonly size?: number,
        readonly font?: string,
    } |
    {
        readonly type: 'BOXED_TEXT',
        readonly text: string,
        readonly boxW: number,
        readonly boxH: number,
        readonly fontSize: number,
        readonly color?: string,
    } |
    {
        readonly type: 'ICON',
        readonly icon: Icon,
        readonly w: number,
        readonly color?: string,
    } |
    {
        readonly type: 'PHYSICS_HULL',
        readonly color?: string,
    } |
    {
        // Draws a line from self position to otherEntity position.
        readonly type: 'CONNECTOR',
        readonly otherEntity: Id,
        readonly color?: string,
    }

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

export interface ConditionalRenderingOption {
    readonly type: 'CONDITIONAL',
    readonly cond: () => boolean,
    readonly ifTrue: RenderingPayload,
    readonly ifFalse: RenderingPayload,
}

export type RenderingPayload = Primitive |
CompoundRenderingOption |
CustomFnRenderingOption |
CustomObjRenderingOption |
ConditionalRenderingOption;
    

export interface RenderingTypedPayload extends TypedPayload<RenderingPayload> {
    readonly type: 'RENDERING';
}