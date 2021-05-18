import { controls } from "../controls/controls.js";
import { input } from "../input/input.js";
export class ControlsSystem {
    constructor() { }
    onEvent(ev) {
        switch (ev.type) {
            case 'ACTIVATE_CONTROL':
                if (ev.toActivate)
                    this.activateControlNamed(ev.toActivate);
                else
                    this.activateNullControl();
                break;
            case 'LEVEL_CHANGED':
                this.activateNullControl();
                break;
        }
    }
    getActiveControl() { return this.activeControl; }
    getActiveControlName() { return this.activeControlName; }
    activateNullControl() {
        var _a;
        (_a = this.activeControl) === null || _a === void 0 ? void 0 : _a.disable();
        input.setFallbackInputHandler(undefined);
        this.activeControl = undefined;
        this.activeControlName = undefined;
    }
    activateControlNamed(name) {
        var _a;
        const c = controls.get(name);
        if (c) {
            console.log('Activating control', name);
            (_a = this.activeControl) === null || _a === void 0 ? void 0 : _a.disable();
            this.activeControl = c;
            this.activeControl.enable();
            input.setFallbackInputHandler(this.activeControl);
            this.activeControlName = name;
        }
    }
}
ControlsSystem.singleton = new ControlsSystem();
const controlsSystem = ControlsSystem.singleton;
export { controlsSystem };
