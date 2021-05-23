import { bus } from "../bus/bus.js";
import { DisablePhysicsMouse, EnablePhysicsMouse, PhysicsControls } from "../events/physics_mouse_events.js";
import { Control } from "./control.js";
// See the Physics system for Magnet impl.
export class MagnetControl extends Control {
    enable() {
        bus.dispatch(new EnablePhysicsMouse(PhysicsControls.MAG));
    }
    disable() {
        bus.dispatch(new DisablePhysicsMouse());
    }
}
