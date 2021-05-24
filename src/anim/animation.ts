import { Id } from "../payloads/entity_id.js";

export interface Anim {
    isDone(): boolean;
    tick(): void;

    // An EntityId that backs this Animation. If the corresponding Entity is destroyed,
    // the animation will be automatically cancelled.
    readonly entityId?: Id|undefined;
}