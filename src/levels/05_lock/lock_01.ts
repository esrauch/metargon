

import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { bus, BusEvent, BusListener } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Color } from "../../gfx/gfx.js";
import { PLAYER } from "../../payloads/entity_id.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor } from "../init_helpers.js";
import { Level } from "../level.js";

export class Lock01 implements Level, BusListener {
    readonly animations: CyclicMoveAnimation[] = [];
    activate(): void {
        initPlayerEntity(new Pos(100, VHEIGHT/2), {
            color: Color.WATER,
            entityCategory: PhysicsEntityCategory.MAGNETIC,
            isStatic: true,
        });
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['LOCK'], 'LOCK');

        initStaticBox(
            PositionedRect.trbl(VHEIGHT-100,VWIDTH,VHEIGHT,0),
            'LOCK ANY BLUE'
        );
    
        bus.dispatch(new ChangePhysicsEntityCategory(PLAYER, PhysicsEntityCategory.MAGNETIC));

        const winSensor =
            initWinSensor(new PositionedRect(new Pos(VWIDTH/2, 1000), 250, 250));
        
        this.animations.push(CyclicMoveAnimation.to(PLAYER, new Pos(1900, VHEIGHT/2), 2));
        this.animations.push(CyclicMoveAnimation.to(winSensor, new Pos(VWIDTH/2, VHEIGHT-1000), 2, /*offsetS*/ 1));

        bus.addListener(this);
    }

    deactivate() {
        bus.removeListener(this);
    }

    onEvent(ev: BusEvent): void {
        if (ev.type !== 'TICK') return;
        this.animations.forEach(anim => anim.tick());
    }
}