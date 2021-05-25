import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Color } from "../../gfx/gfx.js";
import { PLAYER } from "../../payloads/entity_id.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor } from "../init_helpers.js";
export class Lock01 {
    activate() {
        initPlayerEntity(new Pos(100, VHEIGHT / 2), {
            color: Color.WATER,
            entityCategory: PhysicsEntityCategory.MAGNETIC,
            isStatic: true,
        });
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['LOCK'], 'LOCK');
        initStaticBox(PositionedRect.trbl(VHEIGHT - 100, VWIDTH, VHEIGHT, 0), {
            text: 'LOCK = TEMPORARILY FREEZE ANY BLUE'
        });
        bus.dispatch(new ChangePhysicsEntityCategory(PLAYER, PhysicsEntityCategory.MAGNETIC));
        const winSensor = initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, 1000), 250, 250));
        animationSystem.start(CyclicMoveAnimation.to(PLAYER, new Pos(1900, VHEIGHT / 2), 2));
        animationSystem.start(CyclicMoveAnimation.to(winSensor, new Pos(VWIDTH / 2, VHEIGHT - 1000), 2, /*offsetS*/ 1));
    }
}
