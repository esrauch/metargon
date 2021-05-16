import { bus } from "../../bus/bus.js";
import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initControlsWidget, initPlayerEntity, initSensor, initWorldBounds } from "../init_helpers.js";
import { ActiveScreen } from "../screen.js";

// A screen where you just have to move right to win.
export class Rolling01 implements ActiveScreen {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT/4));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['ROLL'], 'ROLL');
        
        const helpTextBox = PositionedRect.fromBounds(
            VHEIGHT/2,
            VWIDTH,
            VHEIGHT/2 + 750,
            0,
        )
        makeEntity({
            label: 'helptext',
            initialPos: helpTextBox.center,
            rendering: {
                type: 'BOXED_TEXT',
                text: 'PLEASE ROLL',
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

        initSensor(
            PositionedRect.fromBounds(VHEIGHT/2 - 250, VWIDTH, VHEIGHT/2, VWIDTH - 250),
            () => bus.dispatch(new Win()),
            {
                text: {value: 'WIN', fontSize: 50},
                color: Color.GRASS,
            });
    }

    deactivate() {}
}