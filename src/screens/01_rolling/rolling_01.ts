import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initStaticBox, initControlsWidget, initPlayerEntity, initWinSensor, initWorldBounds } from "../init_helpers.js";
import { ActiveScreen } from "../screen.js";

// A screen where you just have to move right to win.
export class Rolling01 implements ActiveScreen {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT/4));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['ROLL'], 'ROLL');

        initStaticBox(PositionedRect.fromBounds(
            VHEIGHT/2,
            VWIDTH,
            VHEIGHT/2 + 750,
            0,
        ), 'PLEASE ROLL');

        initWinSensor(PositionedRect.fromBounds(VHEIGHT/2 - 250, VWIDTH, VHEIGHT/2, VWIDTH - 250));
    }

    deactivate() {}
}