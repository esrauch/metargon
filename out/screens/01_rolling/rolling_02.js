import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Lose, Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initSensor } from "../init_helpers.js";
export class Rolling02 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT / 4));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['ROLL'], 'ROLL');
        const helpTextBox = PositionedRect.fromBounds(VHEIGHT / 2, VWIDTH - 250, VHEIGHT / 2 + 750, 250);
        makeEntity({
            label: 'helptext',
            initialPos: helpTextBox.center,
            rendering: {
                type: 'BOXED_TEXT',
                text: 'LOSE = RESET',
                boxW: helpTextBox.w,
                boxH: helpTextBox.h,
                fontSize: 75,
            },
            physics: {
                hull: {
                    type: 'RECT',
                    width: helpTextBox.w,
                    height: helpTextBox.h,
                },
                isStatic: true
            }
        });
        initSensor(PositionedRect.fromBounds(VHEIGHT / 2 - 250, VWIDTH, VHEIGHT / 2, VWIDTH - 250), () => bus.dispatch(new Lose()), {
            text: { value: 'LOSE', fontSize: 50 },
            color: Color.FIRE,
        });
        initSensor(new PositionedRect(new Pos(VWIDTH - 125, VHEIGHT - 125), 250, 250), () => bus.dispatch(new Win()), {
            text: { value: 'WIN', fontSize: 50 },
            color: Color.GRASS,
        });
    }
    deactivate() { }
}
