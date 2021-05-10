export class ApplyForceEvent {
    constructor(entityId, force) {
        this.entityId = entityId;
        this.force = force;
        this.type = 'APPLY_FORCE';
    }
}
export class SetVelocityEvent {
    constructor(entityId, newVelocity) {
        this.entityId = entityId;
        this.newVelocity = newVelocity;
        this.type = 'SET_VELOCITY';
    }
}
