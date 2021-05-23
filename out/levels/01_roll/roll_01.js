import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initStaticBox, initControlsWidget, initPlayerEntity, initWinSensor, initWorldBounds } from "../init_helpers.js";
// A screen where you just have to move right to win.
export class Rolling01 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT / 4));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['ROLL'], 'ROLL');
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH, VHEIGHT / 2 + 750, 0), { text: 'HOLD ON RIGHT ONE-THIRD OF THE SCREEN' });
        initWinSensor(PositionedRect.trbl(VHEIGHT / 2 - 250, VWIDTH, VHEIGHT / 2, VWIDTH - 250));
    }
    deactivate() { }
}
