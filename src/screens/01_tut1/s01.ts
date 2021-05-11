import { Pos } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Id } from "../../payloads/entity_id.js";
import { CONTROL_SIZE, initControlsWidget, initPlayerEntity, initWorldBounds } from "../init_helpers.js";
import { ActiveScreen, crossFadeScreen } from "../screen.js";


export class S01 implements ActiveScreen {
    activate(): void {
        initPlayerEntity();
        initWorldBounds();
        initControlsWidget();
        makeEntity({
            label: 'controls_widget',
            initialPos: new Pos(0, 100)
        },
            {
                type: 'RENDERING',
                payload: {
                    type: "CONTROL_BUTTON",
                    w: CONTROL_SIZE,
                    controlName: 'BALL',
                }
            },
            {
                type: 'HITTEST',
                payload: {
                    w:CONTROL_SIZE, h:CONTROL_SIZE,
                    callback: () => {
                        crossFadeScreen(new S01());
                    }
                }
            })
    }
    deactivate(): void {
    }
    fullyShown(): void {
    }
}