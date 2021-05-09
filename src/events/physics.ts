import { Vec } from "../coords/coords.js";
import { Id } from "../payloads/entity_id.js";

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