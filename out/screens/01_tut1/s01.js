import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { COLOR } from "../../gfx/gfx.js";
import { CONTROL_SIZE, initControlsWidget, initPlayerEntity, initSensor, initWorldBounds } from "../init_helpers.js";
import { crossFadeScreen, FadeSpeed } from "../screen.js";
export class S01 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, 100));
        initWorldBounds();
        initControlsWidget();
        makeEntity({
            label: 'controls_widget',
            initialPos: new Pos(0, 100)
        }, {
            type: 'RENDERING',
            payload: {
                type: "CONTROL_BUTTON",
                w: CONTROL_SIZE,
                controlName: 'BALL',
            }
        }, {
            type: 'HITTEST',
            payload: {
                w: CONTROL_SIZE, h: CONTROL_SIZE,
                callback: () => this.fail(),
            }
        });
        initSensor(PositionedRect.fromBounds(VHEIGHT - 250, 250, VHEIGHT, 0), () => this.succeed(), COLOR.GRASS);
        initSensor(PositionedRect.fromBounds(VHEIGHT - 250, VWIDTH, VHEIGHT, VWIDTH - 250), () => this.fail(), COLOR.FIRE);
    }
    fail() {
        crossFadeScreen(new S01(), FadeSpeed.DEFAULT, COLOR.FIRE);
    }
    succeed() {
        crossFadeScreen(new S01(), FadeSpeed.DEFAULT, COLOR.GRASS);
    }
    deactivate() { }
    fullyShown() { }
}
