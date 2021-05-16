import { bus } from "../../bus/bus.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { ActiveScreen } from '../screen.js';
import { Win } from "../../events/win_loss_events.js";

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
        bus.dispatch(new Win());
    }

}