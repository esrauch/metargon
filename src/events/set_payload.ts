import { Id } from "../payloads/entity_id.js";
import { SomePayload } from "../payloads/payload.js";


export class SetPayload {
    readonly type = 'SET_PAYLOAD';

    constructor(readonly entityId: Id, readonly payload: SomePayload) {}
}
