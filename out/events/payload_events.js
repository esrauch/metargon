export class SetPayloadEvent {
    constructor(entityId, typedPayload) {
        this.entityId = entityId;
        this.typedPayload = typedPayload;
        this.type = 'SET_PAYLOAD';
    }
}
export class ClearPayloadEvent {
    constructor(entityId, payloadType) {
        this.entityId = entityId;
        this.payloadType = payloadType;
        this.type = 'CLEAR_PAYLOAD';
    }
}
