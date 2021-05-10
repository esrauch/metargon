export class SetPayload {
    constructor(entityId, typedPayload) {
        this.entityId = entityId;
        this.typedPayload = typedPayload;
        this.type = 'SET_PAYLOAD';
    }
}
