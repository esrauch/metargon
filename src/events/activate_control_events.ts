import { ControlName } from "../controls/controls.js";


export class ActivateControl {
    readonly type = 'ACTIVATE_CONTROL';

    constructor(readonly toActivate?: ControlName) {}
}