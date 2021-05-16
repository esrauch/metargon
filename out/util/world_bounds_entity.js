import { makeEntity } from "../events/make_entity_helper.js";
import { Pos, Positions, VHEIGHT, VWIDTH } from "../coords/coords.js";
import { LINE_WIDTH } from "../gfx/gfx.js";
// Convenience function for anything that wants to actually show a box containing
// the virtual world.
export function makeWorldBoundsEntity() {
    // Because we really want the box to be "outside" of the contained world, we have to
    // offset points by the line width.
    const hlw = LINE_WIDTH;
    const [T, R, B, L] = [-hlw, VWIDTH + hlw, VHEIGHT + hlw, -hlw];
    return makeEntity({
        label: 'worldbounds',
        initialPos: new Pos(0, 0),
        rendering: {
            type: 'LINELOOP',
            pts: new Positions([
                [L, T],
                [R, T],
                [R, B],
                [L, B]
            ])
        }
    });
}
