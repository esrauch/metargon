import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initStaticBox, initControlsWidget, initPlayerEntity, initWinSensor, initWorldBounds, initControl } from "../init_helpers.js";
import { Level } from "../level.js";

// A screen where you just have to move right to win.
export class Rolling01 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT/4));
        initWorldBounds(/* showWorldBounds */ false);
        initControl('ROLL');

        initStaticBox(PositionedRect.trbl(
            VHEIGHT/2,
            VWIDTH,
            VHEIGHT/2 + 750,
            0,
        ), {text: 'HOLD ON RIGHT ONE-THIRD OF THE SCREEN'});

        initWinSensor(PositionedRect.trbl(VHEIGHT/2 - 250, VWIDTH, VHEIGHT/2, VWIDTH - 250));
    }
}