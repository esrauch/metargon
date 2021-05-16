import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Lose, Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initSensor, initWinSensor, initResetButton, initStaticBox } from "../init_helpers.js";

const level = 'TIME IT';

export class Rolling05 {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds(/* showWorldBounds */ true);
        initControlsWidget(['ROLL'], 'ROLL');
        initResetButton();
        
        initStaticBox(PositionedRect.fromBounds(350, VWIDTH - 150, 350 + 100, 0), level);
        initStaticBox(PositionedRect.fromBounds(650, VWIDTH, 650 + 100, 150), level);
        initStaticBox(PositionedRect.fromBounds(950, VWIDTH, 950 + 100, 150), level);
        initStaticBox(PositionedRect.fromBounds(1250, VWIDTH - 150, 1250 + 100, 0), level);
        initStaticBox(PositionedRect.fromBounds(1550, VWIDTH, 1550 + 100, 150), level);

        initWinSensor(
            new PositionedRect(new Pos(VWIDTH/2, VHEIGHT - 125), VWIDTH, 250));
    }

    deactivate() {}
}