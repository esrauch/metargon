import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initLoseSensor, initWinSensor, initStaticBox } from "../init_helpers.js";
export class Rolling02 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT / 4));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['ROLL'], 'ROLL');
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH - 250, VHEIGHT / 2 + 750, 250), 'LOSE = RESET');
        initLoseSensor(PositionedRect.trbl(VHEIGHT / 2 - 250, VWIDTH, VHEIGHT / 2, VWIDTH - 250));
        initWinSensor(new PositionedRect(new Pos(VWIDTH - 125, VHEIGHT - 125), 250, 250));
    }
    deactivate() { }
}
