import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Color } from "../../gfx/gfx.js";
export class S99 {
    activate() {
        makeEntity({
            label: 'credits1',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 3),
            rendering: {
                type: 'TEXT',
                text: 'å',
                size: 600,
                font: 'Monoton',
                color: Color.GRASS,
            }
        });
        makeEntity({
            label: 'credits2',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT * 2 / 3),
            rendering: {
                type: 'TEXT',
                text: 'FIN',
                size: 600,
                color: Color.GRASS,
            }
        });
    }
    deactivate() { }
}
