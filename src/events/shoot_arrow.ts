import { Vec } from "../coords/coords.js";

export class ShootArrow {
    readonly type = 'SHOOT_ARROW';
    constructor(readonly vec: Vec) {}
}