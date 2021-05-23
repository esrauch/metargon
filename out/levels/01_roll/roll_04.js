import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initWinSensor, initStaticBox, initLoseSensor } from "../init_helpers.js";
export class Rolling04 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH * 3 / 4, 100));
        initWorldBounds(/* showWorldBounds */ true);
        initControlsWidget(['ROLL'], 'ROLL');
        initStaticBox(PositionedRect.trbl(1750, VWIDTH / 2, 1750 + 250, 0));
        initWinSensor(PositionedRect.trbl(1750 - 250, 250, 1750, 0));
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 250, 250, VHEIGHT, 0));
    }
    deactivate() { }
}
