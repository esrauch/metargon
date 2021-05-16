import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Lose, Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initSensor, initLoseSensor, initWinSensor, initStaticBox } from "../init_helpers.js";

export class Rolling03 {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds(/* showWorldBounds */ true);
        initControlsWidget(['ROLL'], 'ROLL');
        
        initStaticBox(PositionedRect.fromBounds(350, VWIDTH - 100, 350 + 200, 0), 'AIR BUD');
       
        initLoseSensor(
            PositionedRect.fromBounds(VHEIGHT/2 - 250, VWIDTH, VHEIGHT/2, VWIDTH - 250));
        initLoseSensor(
            PositionedRect.fromBounds(VHEIGHT/2 - 250, 1500, VHEIGHT/2, 0));

        initWinSensor(
            new PositionedRect(new Pos(VWIDTH/2, VHEIGHT - 125), VWIDTH, 250));
    }

    deactivate() {}
}