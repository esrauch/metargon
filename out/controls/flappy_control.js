import { ApplyForce } from "../events/physics_events.js";
import { bus } from "../bus/bus.js";
import { Vec } from "../coords/coords.js";
import { PLAYER } from "../payloads/entity_id.js";
import { Control } from "./control.js";
// Control similar to Flappy Bird: tap to apply an upward force.
export class FlappyControl extends Control {
    onDown() {
        bus.dispatch(new ApplyForce(PLAYER, new Vec(0, -300)));
    }
}
