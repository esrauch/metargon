import { ApplyForce, SetVelocity } from "../events/physics_events.js";
import { bus } from "../bus/bus.js";
import { Pos, Vec } from "../coords/coords.js";
import { VectorControl, VisibleVectorContol } from "./vector_control.js";
import { Id, PLAYER } from "../payloads/entity_id.js";
import { CreateEntity, DestroyEntity } from "../events/core_entity_events.js";
import { ClearPayloadEvent, SetPayloadEvent } from "../events/payload_events.js";

// Classic pull-and-drag "Golf" control: drag and release to apply force to something.
export class GolfControl extends VisibleVectorContol {
    commit(finalVec: Vec): void {
        bus.dispatch(new SetVelocity(PLAYER, finalVec));
    }
}