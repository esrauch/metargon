import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initResetButton, initWinSensor, initStaticBox } from "../init_helpers.js";
// Temporarily removed to just let the user jump directly into both falling
// and moving self.
export class Shot03_old {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT / 4));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['SHOT'], 'SHOT');
        initResetButton();
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH, VHEIGHT / 2 + 750, 0), { text: 'ROLL YOURSELF' });
        initWinSensor(PositionedRect.trbl(VHEIGHT / 2 - 250, VWIDTH / 2, VHEIGHT / 2, VWIDTH / 2 - 250));
    }
    deactivate() {
    }
}
