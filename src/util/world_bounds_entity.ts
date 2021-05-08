

import { makeEntity } from "../events/make_entity_helper.js";
import { Positions, VHEIGHT, VWIDTH } from "../coords/coords.js";
import { Id } from "../systems/entity/entity_id.js";

// Convenience function for anything that wants to actually show a box containing
// the virtual world.
export function makeWorldBoundsEntity(): Id {
    const [T, R, B, L] = [0, VWIDTH, VHEIGHT, 0];
    return makeEntity({
        label: 'worldbounds',
        renderingData: {
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