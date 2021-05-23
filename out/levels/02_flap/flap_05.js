import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor } from "../init_helpers.js";
const level = { text: 'USE TOP CONTROLS' };
export class Flapping05 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 250));
        initWorldBounds();
        initControlsWidget(['FLAP', 'ROLL']);
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, 300), VWIDTH, 100));
        initStaticBox(PositionedRect.trbl(550, VWIDTH - 150, 550 + 100, 0), level);
        initStaticBox(PositionedRect.trbl(1550, VWIDTH, 1550 + 100, 150), level);
    }
    deactivate() {
    }
}
