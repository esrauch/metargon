import { bus } from "../../bus/bus.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
export class S00 {
    constructor() { }
    activate() {
        document.fonts.load('10px Monoton').then(() => {
            makeEntity({
                label: 'splash',
                initialPos: new Pos(VWIDTH / 2, VHEIGHT / 2),
                rendering: {
                    type: 'TEXT',
                    text: 'å',
                    size: VHEIGHT / 2,
                    font: 'Monoton',
                    color: Color.GRASS,
                }
            });
        });
    }
    fullyShown() {
        bus.dispatch(new Win());
    }
}
