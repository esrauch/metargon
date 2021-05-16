import { bus, BusEvent, BusListener } from "../../bus/bus.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { ActiveScreen } from '../screen.js';
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";

export class S00 implements ActiveScreen, BusListener {
    constructor() { }

    activate() {
        bus.addListener(this);

        (document as any).fonts.load('10px Monoton').then(() => {
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
    
    deactivate() {
        bus.removeListener(this);
    }

    onEvent(ev: BusEvent): void {
        if (ev.type === 'SCREEN_FULLY_SHOWN') 
            bus.dispatch(new Win());
    }
}