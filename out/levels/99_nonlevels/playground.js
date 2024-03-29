import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initResetButton } from "../init_helpers.js";
export class PlaygroundScreen {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT / 4));
        initWorldBounds();
        initControlsWidget();
        initResetButton();
    }
    deactivate() { }
}
