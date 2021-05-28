import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initControl, initControlsWidget, initPlayerEntity, initStaticBox, initWinSensor, initWorldBounds } from "../init_helpers.js";


export class Tilt01 {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT/2));
        initWorldBounds(/* showWorldBounds */ false);
        initControl('TILT');

        initStaticBox(PositionedRect.trbl(
            VHEIGHT/2,
            VWIDTH,
            VHEIGHT/2 + 750,
            0,
        ), {text: 'TILT!'});

        initWinSensor(new PositionedRect(new Pos(VWIDTH/2, 500), 250, 250));
    }
}