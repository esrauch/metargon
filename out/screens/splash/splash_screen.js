import { bus } from "../../bus/bus.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { crossFadeScreen } from '../screen.js';
export class SplashScreen {
    constructor(nextScreen) {
        this.nextScreen = nextScreen;
    }
    activate() {
        this.dispEntity = makeEntity({
            label: 'splash',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 2),
            rendering: {
                type: 'TEXT',
                text: 'å',
                size: VHEIGHT / 2,
                font: 'Monoton',
            }
        });
    }
    fullyShown() {
        crossFadeScreen(this.nextScreen);
    }
    deactivate() {
        if (this.dispEntity !== undefined)
            bus.dispatch(new DestroyEntity(this.dispEntity));
    }
}
