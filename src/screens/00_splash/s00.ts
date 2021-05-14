import { bus } from "../../bus/bus.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { Id } from "../../payloads/entity_id.js";
import { ActiveScreen, crossFadeScreen } from '../screen.js';
import { getScreenNumber } from "../screens.js";

export class S00 implements ActiveScreen {
    constructor() { }

    activate() {
        (document as any).fonts.load('10px Monoton').then(() => {
            makeEntity({
                label: 'splash',
                initialPos: new Pos(VWIDTH / 2, VHEIGHT / 2),
                rendering: {
                    type: 'TEXT',
                    text: 'å',
                    size: VHEIGHT / 2,
                    font: 'Monoton',
                }
            });
        });
    }

    fullyShown() {
        crossFadeScreen(getScreenNumber(1));
    }

}