import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { initPlayerEntity, initWorldBounds, initControl } from "../init_helpers.js";
export class Shot05 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 250));
        initWorldBounds();
        initControl('SHOT');
    }
}
