import { Id } from "../payloads/entity_id.js";
import { PayloadType, SomeTypedPayload } from "../payloads/payload.js";


export class SetPayloadEvent {
    readonly type = 'SET_PAYLOAD';

    constructor(readonly entityId: Id, readonly typedPayload: SomeTypedPayload) {}
}

export class ClearPayloadEvent {
    readonly type = 'CLEAR_PAYLOAD';
    constructor(readonly entityId: Id, readonly payloadType: PayloadType) {}
}