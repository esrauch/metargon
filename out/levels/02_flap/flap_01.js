import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initStaticBox, initWinSensor, initControl } from "../init_helpers.js";
export class Flapping01 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2));
        initWorldBounds(/* showWorldBounds */ false);
        initControl('FLAP');
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH, VHEIGHT / 2 + 750, 0), { text: 'FLAP = TAP' });
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, 500), 250, 250));
    }
}
