import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton } from "../init_helpers.js";
import { Level } from "../level.js";

export class Mag01 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT/2));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['MAG'], 'MAG');

        initStaticBox(PositionedRect.trbl(
            VHEIGHT/2,
            VWIDTH,
            VHEIGHT/2 + 750,
            0,
        ), 'MAG MOVES BLUE');

        initWinSensor(new PositionedRect(new Pos(VWIDTH/2, 500), 250, 250));
    }

    deactivate() {}
}