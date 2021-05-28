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
export class ChangePhysicsEntityCategory {
    constructor(entityId, physicsEntityCategory) {
        this.entityId = entityId;
        this.physicsEntityCategory = physicsEntityCategory;
        this.type = 'CHANGE_PHYSICS_ENTITY_CATEGORY';
    }
}
export class SetGravity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = 'SET_GRAVITY';
    }
}
