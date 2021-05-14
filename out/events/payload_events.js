export class SetPayload {
    constructor(entityId, typedPayload) {
        this.entityId = entityId;
        this.typedPayload = typedPayload;
        this.type = 'SET_PAYLOAD';
    }
}
export class ClearPayload {
    constructor(entityId, payloadType) {
        this.entityId = entityId;
        this.payloadType = payloadType;
        this.type = 'CLEAR_PAYLOAD';
    }
}
