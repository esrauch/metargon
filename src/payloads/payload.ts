import { ChessPayload } from "./chess_payload.js";
import { RenderingPayload } from "./rendering_payload.js";
import { CorePayload } from './core_payload.js';
import { PhysicsPayload } from "./physics_payload.js";

export interface Payload<T> {
    readonly type: String;
    readonly value: T
}

export type SomePayload =
    CorePayload |
    PhysicsPayload |
    RenderingPayload |
    ChessPayload;

export type PayloadType = SomePayload["type"];

export type TypedPayload<T extends PayloadType> = (SomePayload & { type: T });

export function isPayloadType<T extends PayloadType>(p: SomePayload, type: T): p is TypedPayload<T> {
    return p.type === type;
}