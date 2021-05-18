import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton } from "../init_helpers.js";
import { Level } from "../level.js";

export class Flapping01 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT/2));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['FLAPPY'], 'FLAPPY');
        initResetButton();

        initStaticBox(PositionedRect.fromBounds(
            VHEIGHT/2,
            VWIDTH,
            VHEIGHT/2 + 750,
            0,
        ), 'TAP TO FLAP');

        initWinSensor(new PositionedRect(new Pos(VWIDTH/2, 500), 250, 250));
    }

    deactivate() {}
}