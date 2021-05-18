import { BusEvent, BusListener } from "../bus/bus.js";
import { Control } from "../controls/control.js";
import { ControlName, controls } from "../controls/controls.js";
import { input } from "../input/input.js";


export class ControlsSystem implements BusListener {
    private constructor() {}
    static singleton = new ControlsSystem();

    private activeControl?: Control;
    private activeControlName?: ControlName;

    onEvent(ev: BusEvent) {
        switch (ev.type) {
            case 'ACTIVATE_CONTROL':
                if (ev.toActivate) this.activateControlNamed(ev.toActivate)
                else this.activateNullControl();
                break;
            case 'LEVEL_CHANGED':
                this.activateNullControl();
                break;
        }

    }

    getActiveControl(): Control | undefined { return this.activeControl; }
    getActiveControlName(): ControlName | undefined { return this.activeControlName; }

    private activateNullControl() {
        this.activeControl?.disable();
        input.setFallbackInputHandler(undefined);
        this.activeControl = undefined;
        this.activeControlName = undefined;
    }

    private activateControlNamed(name: ControlName) {
        const c = controls.get(name);
        if (c) {
            console.log('Activating control', name);
            this.activeControl?.disable();
            this.activeControl = c;
            this.activeControl.enable();
            input.setFallbackInputHandler(this.activeControl);
            this.activeControlName = name;
        }
    }
}

const controlsSystem = ControlsSystem.singleton;
export { controlsSystem };