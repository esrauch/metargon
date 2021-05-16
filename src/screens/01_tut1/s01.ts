import { bus } from "../../bus/bus.js";
import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Lose, Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initControlsWidget, initPlayerEntity, initSensor, initWorldBounds } from "../init_helpers.js";
import { ActiveScreen } from "../screen.js";


export class S01 implements ActiveScreen {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, 100));
        initWorldBounds();
        initControlsWidget();
        
        const helpTextBox = PositionedRect.fromBounds(
            0,
            VWIDTH,
            VHEIGHT,
            VWIDTH * 2/3,
        )
        makeEntity({
            label: 'helptext',
            initialPos: helpTextBox.center,
        }, {
            type: 'RENDERING',
            payload: {
                type: 'BOXED_TEXT',
                text: 'HOLD HERE',
                boxW: helpTextBox.w,
                boxH: helpTextBox.h,
                fontSize: 75,
            }
        }
        );

        initSensor(
            PositionedRect.fromBounds(VHEIGHT - 250, 250, VHEIGHT, 0),
            () => bus.dispatch(new Win()),
            Color.GRASS);
        initSensor(
            PositionedRect.fromBounds(VHEIGHT - 250, VWIDTH, VHEIGHT, VWIDTH - 250),
            () => bus.dispatch(new Lose()),
            Color.FIRE);
    }

    // private fail(): void {
    //     crossFadeScreen(new S01(), FadeSpeed.DEFAULT, COLOR.FIRE);
    // }

    // private succeed(): void {
    //     crossFadeScreen(new S01(), FadeSpeed.DEFAULT, COLOR.GRASS);
    // }
}