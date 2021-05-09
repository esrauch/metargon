import { ChessTypedPayload } from "./chess_payload.js";
import { RenderingTypedPayload } from "./rendering_payload.js";
import { CoreTypedPayload } from './core_payload.js';
import { PhysicsTypedPayload } from "./physics_payload.js";
import { WidgetTypedPayload } from "./widget_payload.js";

// TODO: maybe "TaggedPayload" instead
export interface TypedPayload<T> {
    readonly type: String;
    readonly payload: T
}

export type SomeTypedPayload =
    CoreTypedPayload |
    PhysicsTypedPayload |
    RenderingTypedPayload |
    ChessTypedPayload |
    WidgetTypedPayload;

export type PayloadType = SomeTypedPayload["type"];

export type SpecificTypedPayload<T extends PayloadType> = (SomeTypedPayload & { type: T });

export function isPayloadType<T extends PayloadType>(p: SomeTypedPayload, type: T): p is SpecificTypedPayload<T> {
    return p.type === type;
}