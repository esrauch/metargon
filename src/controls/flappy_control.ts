import { ApplyForceEvent } from "../bus/events/physics.js";
import { bus } from "../bus/bus.js";
import { Vec } from "../coords/coords.js";
import { AbstractPointerEvtControl } from "./pointer_helper.js";

// Control similar to Flappy Bird: tap to apply an upward force.
export class FlappyControl extends AbstractPointerEvtControl {
    onDown(ev: PointerEvent): void {
        bus.dispatch(new ApplyForceEvent(1, new Vec(0, -250)));
    }
    onMove(ev: PointerEvent): void {
    }
    onUp(ev: PointerEvent): void {
    }
    onCancel(ev: PointerEvent): void {
    }
}