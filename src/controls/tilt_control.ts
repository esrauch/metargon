import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { SetGravity } from "../events/physics_events.js";
import { tilt } from "../input/tilt.js";
import { Id } from "../payloads/entity_id.js";
import { Control } from "./control.js";


export class TiltGravityControl extends Control implements BusListener {
    private indicatorEntity?: Id;

    enable() {
        tilt.enable();
        bus.dispatch(new SetGravity(0, 0));
        bus.addListener(this);
    }

    disable() {
        bus.removeListener(this);
        tilt.disable();
    }

    onEvent(ev: BusEvent): void {
        if (ev.type !== 'TICK') return;

        bus.dispatch(new SetGravity(tilt.dir.dx * 2, tilt.dir.dy * 2), /*spammy*/ true);
    }
}