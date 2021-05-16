import { Icon } from "../../payloads/rendering_payload.js";
import { assertUnreachable } from "../../util/assert.js";
export function drawIcon(gfx, pos, icon, w) {
    switch (icon) {
        case Icon.SPIN:
            drawSpinIcon(gfx, pos, w);
            return;
    }
    return assertUnreachable(icon);
}
function drawSpinIcon(gfx, pos, w) {
}
