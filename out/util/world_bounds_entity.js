import { makeEntity } from "../events/make_entity_helper.js";
import { Positions, VHEIGHT, VWIDTH } from "../coords/coords.js";
// Convenience function for anything that wants to actually show a box containing
// the virtual world.
export function makeWorldBoundsEntity() {
    const [T, R, B, L] = [0, VWIDTH, VHEIGHT, 0];
    return makeEntity({
        label: 'worldbounds',
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
