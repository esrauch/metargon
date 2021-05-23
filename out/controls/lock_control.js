import { bus } from "../bus/bus.js";
import { DisablePhysicsMouse, EnablePhysicsMouse, PhysicsControls } from "../events/physics_mouse_events.js";
import { Control } from "./control.js";
// See PhysicsSystem for Lock impl
export class LockControl extends Control {
    enable() {
        bus.dispatch(new EnablePhysicsMouse(PhysicsControls.LOCK));
    }
    disable() {
        bus.dispatch(new DisablePhysicsMouse());
    }
}
