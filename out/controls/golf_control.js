import { SetVelocity } from "../events/physics_events.js";
import { bus } from "../bus/bus.js";
import { VisibleVectorContol } from "./vector_control.js";
import { PLAYER } from "../payloads/entity_id.js";
// Classic pull-and-drag "Golf" control: drag and release to apply force to something.
export class GolfControl extends VisibleVectorContol {
    commit(finalVec) {
        bus.dispatch(new SetVelocity(PLAYER, finalVec));
    }
}
