export class EnablePhysics {
    constructor(entityId, physicsData) {
        this.entityId = entityId;
        this.physicsData = physicsData;
        this.type = 'ENABLE_PHYSICS';
    }
}
export class ApplyForce {
    constructor(entityId, force) {
        this.entityId = entityId;
        this.force = force;
        this.type = 'APPLY_FORCE';
    }
}
export class SetVelocity {
    constructor(entityId, newVelocity) {
        this.entityId = entityId;
        this.newVelocity = newVelocity;
        this.type = 'SET_VELOCITY';
    }
}
