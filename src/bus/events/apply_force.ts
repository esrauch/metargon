import { Vec } from "../../coords/coords.js";

export class ApplyForceEvent {
    readonly type = 'APPLY_FORCE';
    constructor(
        readonly entityId: number,
        readonly force: Vec) {
    }
}