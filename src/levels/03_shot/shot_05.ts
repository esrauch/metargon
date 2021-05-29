
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { Id } from "../../payloads/entity_id.js";
import { initPlayerEntity, initWorldBounds, initControl } from "../init_helpers.js";
import { Level } from "../level.js";

export class Shot05 implements Level {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 250));
        initWorldBounds();
        initControl('SHOT');
    }
}