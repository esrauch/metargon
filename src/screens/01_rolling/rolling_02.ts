import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Lose, Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initSensor, initLoseSensor, initWinSensor, initStaticBox } from "../init_helpers.js";

export class Rolling02 {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT/4));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['ROLL'], 'ROLL');
        
        initStaticBox(PositionedRect.fromBounds(
            VHEIGHT/2,
            VWIDTH-250,
            VHEIGHT/2 + 750,
            250,
        ), 'LOSE = RESET');

        initLoseSensor(
            PositionedRect.fromBounds(VHEIGHT/2 - 250, VWIDTH, VHEIGHT/2, VWIDTH - 250));

        initWinSensor(
            new PositionedRect(new Pos(VWIDTH - 125, VHEIGHT - 125), 250, 250));
    }

    deactivate() {}
}