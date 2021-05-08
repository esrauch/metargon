import { ApplyForce } from "../events/physics.js";
import { bus } from "../bus/bus.js";
import { Vec } from "../coords/coords.js";
import { AbstractPointerEvtControl } from "./pointer_helper.js";
import { PLAYER } from "../systems/entity/entity_id.js";

// Control similar to Flappy Bird: tap to apply an upward force.
export class FlappyControl extends AbstractPointerEvtControl {
    onDown(ev: PointerEvent): void {
        bus.dispatch(new ApplyForce(PLAYER, new Vec(0, -250)));
    }
    onMove(ev: PointerEvent): void {
    }
    onUp(ev: PointerEvent): void {
    }
    onCancel(ev: PointerEvent): void {
    }
}