import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initWinSensor, initResetButton, initStaticBox, initLoseSensor, initControl } from "../init_helpers.js";


export class Rolling04 {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH * 3/ 4, 100));
        initWorldBounds();
        initControl('ROLL');
        
        initStaticBox(PositionedRect.trbl(1750, VWIDTH / 2, 1750 + 250, 0));

        initWinSensor(PositionedRect.trbl(1750-250, 250, 1750, 0));
        initLoseSensor(PositionedRect.trbl(VHEIGHT-250, 250,VHEIGHT,0));
    }
}