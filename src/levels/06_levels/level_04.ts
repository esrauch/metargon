

import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initStaticBox, initWinSensor, initLoseSensor, initControls } from "../init_helpers.js";
import { Level } from "../level.js";

export class Level04 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds();
        initControls('ROLL');

        initWinSensor(
            new PositionedRect(new Pos(VWIDTH/2, VHEIGHT - 125), VWIDTH, 250));
        
        const holdup = PositionedRect.trbl(350, VWIDTH - 150, 350 + 100, 0);
        initStaticBox(holdup);

        initLoseSensor(PositionedRect.trbl(holdup.b,VWIDTH-55,VHEIGHT,0));
    }

    deactivate() {}
}