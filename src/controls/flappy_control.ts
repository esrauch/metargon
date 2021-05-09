import { ApplyForce } from "../events/physics.js";
import { bus } from "../bus/bus.js";
import { Vec } from "../coords/coords.js";
import { PointerEvtControl } from "./pointer_helper.js";
import { PLAYER } from "../payloads/entity_id.js";

// Control similar to Flappy Bird: tap to apply an upward force.
export class FlappyControl extends PointerEvtControl {
    onDown(): void {
        bus.dispatch(new ApplyForce(PLAYER, new Vec(0, -250)));
    }
}