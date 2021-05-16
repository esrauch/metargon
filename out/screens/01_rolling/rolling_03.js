import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initLoseSensor, initWinSensor, initStaticBox } from "../init_helpers.js";
export class Rolling03 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds(/* showWorldBounds */ true);
        initControlsWidget(['ROLL'], 'ROLL');
        initStaticBox(PositionedRect.fromBounds(350, VWIDTH - 100, 350 + 200, 0), 'AIR BUD');
        initLoseSensor(PositionedRect.fromBounds(VHEIGHT / 2 - 250, VWIDTH, VHEIGHT / 2, VWIDTH - 250));
        initLoseSensor(PositionedRect.fromBounds(VHEIGHT / 2 - 250, 1500, VHEIGHT / 2, 0));
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, VHEIGHT - 125), VWIDTH, 250));
    }
    deactivate() { }
}
