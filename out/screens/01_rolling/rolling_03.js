import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Lose, Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initSensor } from "../init_helpers.js";
function makeBox(rect) {
    makeEntity({
        label: 'box',
        initialPos: rect.center,
        rendering: {
            type: 'BOXED_TEXT',
            text: 'AIR CONTROL',
            boxW: rect.w,
            boxH: rect.h,
            fontSize: 75,
        },
        physics: {
            hull: {
                type: 'RECT',
                width: rect.w,
                height: rect.h,
            },
            isStatic: true
        }
    });
}
export class Rolling03 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds(/* showWorldBounds */ true);
        initControlsWidget(['ROLL'], 'ROLL');
        makeBox(PositionedRect.fromBounds(350, VWIDTH - 100, 350 + 200, 0));
        initSensor(PositionedRect.fromBounds(VHEIGHT / 2 - 250, VWIDTH, VHEIGHT / 2, VWIDTH - 250), () => bus.dispatch(new Lose()), {
            text: { value: 'LOSE', fontSize: 50 },
            color: Color.FIRE,
        });
        initSensor(PositionedRect.fromBounds(VHEIGHT / 2 - 250, 1500, VHEIGHT / 2, 0), () => bus.dispatch(new Lose()), {
            text: { value: 'LOSE', fontSize: 50 },
            color: Color.FIRE,
        });
        initSensor(new PositionedRect(new Pos(VWIDTH / 2, VHEIGHT - 125), VWIDTH, 250), () => bus.dispatch(new Win()), {
            text: { value: 'WIN', fontSize: 50 },
            color: Color.GRASS,
        });
    }
    deactivate() { }
}
