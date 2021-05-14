import { Id } from "../payloads/entity_id.js";
import { PayloadType, SomeTypedPayload } from "../payloads/payload.js";


export class SetPayload {
    readonly type = 'SET_PAYLOAD';

    constructor(readonly entityId: Id, readonly typedPayload: SomeTypedPayload) {}
}

export class ClearPayload {
    readonly type = 'CLEAR_PAYLOAD';
    constructor(readonly entityId: Id, readonly payloadType: PayloadType) {}
}