import { Vec } from "../coords/coords.js";
import { Id } from "../payloads/entity_id.js";
import { PhysicsEntityCategory } from "../payloads/physics_payload.js";

export class ApplyForce {
    readonly type = 'APPLY_FORCE';
    constructor(
        readonly entityId: Id,
        readonly force: Vec) {
    }
}

export class SetVelocity {
    readonly type = 'SET_VELOCITY';
    constructor(
        readonly entityId: Id,
        readonly newVelocity: Vec) {
    }
}

export class RollMove {
    readonly type = 'ROLL_MOVE';
    constructor(
        readonly entityId: Id,
        readonly dir: number) {
    }
}

export class ChangePhysicsEntityCategory {
    readonly type = 'CHANGE_PHYSICS_ENTITY_CATEGORY';
    constructor(
        readonly entityId: Id,
        readonly physicsEntityCategory: PhysicsEntityCategory,
    ) {}
}