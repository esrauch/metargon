import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { Pos, VWIDTH, VHEIGHT, Vec } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton, initLoseSensor } from "../init_helpers.js";
import { Level } from "../level.js";

const level = 'USE TOP CONTROLS';
export class Flapping05 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 250));
        initWorldBounds();
        initControlsWidget(['FLAPPY', 'ROLL']);
        initResetButton();

        initWinSensor(
            new PositionedRect(new Pos(VWIDTH/2, 300), VWIDTH, 100));
        
        initStaticBox(PositionedRect.trbl(550, VWIDTH - 150, 550 + 100, 0), level);
        initStaticBox(PositionedRect.trbl(1550, VWIDTH, 1550 + 100, 150), level);
    }

    deactivate() {
    }
}