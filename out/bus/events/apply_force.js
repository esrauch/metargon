export class ApplyForceEvent {
    constructor(entityId, force) {
        this.entityId = entityId;
        this.force = force;
        this.type = 'APPLY_FORCE';
    }
}
