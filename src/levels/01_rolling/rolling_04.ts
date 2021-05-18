import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initWinSensor, initResetButton, initStaticBox } from "../init_helpers.js";


export class Rolling04 {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH * 3/ 4, 100));
        initWorldBounds(/* showWorldBounds */ true);
        initControlsWidget(['ROLL'], 'ROLL');
        initResetButton();
        
        initStaticBox(PositionedRect.trbl(1750, VWIDTH / 2, 1750 + 250, 0), 'TAP X TO RESET');

        initWinSensor(PositionedRect.trbl(1750-250, 250, 1750, 0));
    }

    deactivate() {}
}