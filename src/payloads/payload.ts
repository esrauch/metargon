import { ChessPayload } from "./chess_payload.js";
import { RenderingPayload } from "./rendering_payload.js";
import {CorePayload} from './core_payload.js';
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