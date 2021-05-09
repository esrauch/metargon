import { bus } from "../../bus/bus.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { Id } from "../../payloads/entity_id.js";
import { ActiveScreen, crossFadeScreen } from '../screen.js';

export class SplashScreen implements ActiveScreen {
    private dispEntity?: Id;
    constructor(readonly nextScreen: ActiveScreen) {}

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