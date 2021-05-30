import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Color } from "../../gfx/gfx.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton, initNonRotatingBox, initLoseSensor } from "../init_helpers.js";
import { Level } from "../level.js";

export class Level06 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT/2));
        initWorldBounds();
        initControlsWidget(['MAG'], 'MAG');
        initResetButton();

        initStaticBox(PositionedRect.trbl(
            VHEIGHT/2,
            VWIDTH/3,
            VHEIGHT/2 + 750,
            0));
        initStaticBox(PositionedRect.trbl(
            VHEIGHT/2+175,
            VWIDTH,
            VHEIGHT,
            0));            

        initWinSensor(PositionedRect.trbl(0,VWIDTH, VHEIGHT/3, VWIDTH * 3/4));

       
        const b=initNonRotatingBox(new PositionedRect(new Pos(VWIDTH/2, VHEIGHT/4), 350, 175), Color.WATER);
        bus.dispatch(new ChangePhysicsEntityCategory(b, PhysicsEntityCategory.MAGNETIC));
    }
}