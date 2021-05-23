import { ChessTypedPayload } from "./chess_payload.js";
import { RenderingTypedPayload } from "./rendering_payload.js";
import { CoreTypedPayload } from './core_payload.js';
import { PhysicsTypedPayload } from "./physics_payload.js";
import { HittestTypedPayload } from "./hittest_payload.js";
import { PositionAttachmentTypedPayload } from "./position_attachment_payload.js";
import { PositionTypedPayload } from "./fixed_position_payload.js";
import { SensorTypedPayload } from "./sensor_payload.js";
import { LockedTypedPayload } from "./locked_payload.js";

// TODO: maybe "TaggedPayload" instead
export interface TypedPayload<T> {
    readonly type: String;
    readonly payload: T
}

export type SomeTypedPayload =
    CoreTypedPayload |
    PositionTypedPayload |
    PhysicsTypedPayload |
    RenderingTypedPayload |
    ChessTypedPayload |
    HittestTypedPayload |
    PositionAttachmentTypedPayload |
    SensorTypedPayload |
    LockedTypedPayload;

export type PayloadType = SomeTypedPayload["type"];

export type SpecificTypedPayload<T extends PayloadType> = (SomeTypedPayload & { type: T });

export function isPayloadType<T extends PayloadType>(p: SomeTypedPayload, type: T): p is SpecificTypedPayload<T> {
    return p.type === type;
}