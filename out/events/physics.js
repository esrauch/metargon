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
export class RollMove {
    constructor(entityId, dir) {
        this.entityId = entityId;
        this.dir = dir;
        this.type = 'ROLL_MOVE';
    }
}
