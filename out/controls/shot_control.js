import { bus } from "../bus/bus.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { SetVelocity } from "../events/physics_events.js";
import { PLAYER } from "../payloads/entity_id.js";
import { getCenterPosition } from "../systems/getters.js";
import { VisibleVectorContol } from "./vector_control.js";
const projectileRadius = 20;
export class ShotControl extends VisibleVectorContol {
    commit(finalVec) {
        const playerPos = getCenterPosition(PLAYER);
        const projectile = makeEntity({
            initialPos: playerPos,
            label: 'shot',
            rendering: {
                type: 'CIRCLE',
                radius: projectileRadius,
            },
            physics: {
                hull: {
                    type: 'CIRCLE',
                    radius: projectileRadius,
                }
            }
        });
        bus.dispatch(new SetVelocity(projectile, finalVec));
    }
}
