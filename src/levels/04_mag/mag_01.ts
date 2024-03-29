import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { Color } from "../../gfx/gfx.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initControl } from "../init_helpers.js";
import { Level } from "../level.js";

export class Mag01 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT/2), {
            color: Color.WATER,
            entityCategory: PhysicsEntityCategory.MAGNETIC
        });
        initWorldBounds(/* showWorldBounds */ false);
        initControl('MAG');

        initStaticBox(PositionedRect.trbl(
            VHEIGHT/2,
            VWIDTH,
            VHEIGHT/2 + 750,
            0,
        ), {text: 'MAG = DRAG ANY BLUE'});

        initWinSensor(new PositionedRect(new Pos(VWIDTH/2, 500), 250, 250));
    }
}