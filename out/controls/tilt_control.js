import { bus } from "../bus/bus.js";
import { SetGravity } from "../events/physics_events.js";
import { tilt } from "../input/tilt.js";
import { Control } from "./control.js";
export class TiltGravityControl extends Control {
    enable() {
        tilt.enable();
        bus.dispatch(new SetGravity(0, 0));
        bus.addListener(this);
    }
    disable() {
        bus.removeListener(this);
        tilt.disable();
    }
    onEvent(ev) {
        if (ev.type !== 'TICK')
            return;
        bus.dispatch(new SetGravity(tilt.dir.dx * 2, tilt.dir.dy * 2), /*spammy*/ true);
    }
}
