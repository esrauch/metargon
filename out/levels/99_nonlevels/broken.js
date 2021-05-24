import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Color } from "../../gfx/gfx.js";
export class BrokenScreen {
    activate() {
        makeEntity({
            label: 'logo',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 3),
            rendering: {
                type: 'TEXT',
                text: 'å',
                size: 600,
                font: 'Monoton',
                color: Color.FIRE,
            }
        });
        makeEntity({
            label: 'blame',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT * 2 / 3),
            rendering: {
                type: 'TEXT',
                text: 'U BROKE IT :(',
                size: 400,
                color: Color.FIRE,
            }
        });
    }
    deactivate() { }
}
