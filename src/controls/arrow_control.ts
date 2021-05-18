import { bus } from "../bus/bus.js";
import { Vec } from "../coords/coords.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { SetVelocity } from "../events/physics_events.js";
import { ShootArrow } from "../events/shoot_arrow.js";
import { PLAYER } from "../payloads/entity_id.js";
import { getCenterPosition } from "../systems/getters.js";
import { VisibleVectorContol } from "./vector_control.js";

const projectileRadius = 10;

export class ArrowControl extends VisibleVectorContol {
    commit(finalVec: Vec): void {
        const playerPos = getCenterPosition(PLAYER);
        const projectile = makeEntity({
            initialPos: playerPos,
            label: 'arrow',
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
        })
        bus.dispatch(new SetVelocity(projectile, finalVec));
    }
}