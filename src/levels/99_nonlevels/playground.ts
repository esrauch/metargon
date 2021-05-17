import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton } from "../init_helpers.js";


export class PlaygroundScreen {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT/4));
        initWorldBounds();
        initControlsWidget();
        initResetButton();
    }

    deactivate() {}
}