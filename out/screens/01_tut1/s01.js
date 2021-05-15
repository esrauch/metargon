import { Pos, VWIDTH } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { CONTROL_SIZE, initControlsWidget, initPlayerEntity, initWorldBounds } from "../init_helpers.js";
import { crossFadeScreen } from "../screen.js";
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
                callback: () => {
                    crossFadeScreen(new S01());
                }
            }
        });
    }
    deactivate() {
    }
    fullyShown() {
    }
}
