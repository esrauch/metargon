export class DestroyEntityEvent {
    constructor(entityId) {
        this.entityId = entityId;
        this.type = 'DESTROY_ENTITY';
    }
}
