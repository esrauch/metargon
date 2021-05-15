import { activateControlNamed } from "../controls/controls.js";
import { Pos, VWIDTH, VHEIGHT } from "../coords/coords.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { PLAYER } from "../payloads/entity_id.js";
import { getRotation } from "../systems/getters.js";
import { makeWorldBoundsEntity } from "../util/world_bounds_entity.js";
export function initPlayerEntity(pos) {
    return makeEntity({
        entityId: PLAYER,
        initialPos: pos || new Pos(200, 200),
        label: "player",
        rendering: {
            type: 'FUNCTION',
            fn: (gfx, id, center) => {
                gfx.fillcircle(center, 50);
                const angle = getRotation(id) || 0;
                const eye = new Pos(center.x + Math.cos(angle) * 20, center.y + Math.sin(angle) * 20);
                gfx.fillcircle(eye, 20, '#000');
            }
        },
        physics: {
            hull: {
                type: 'CIRCLE',
                radius: 50,
            }
        }
    });
}
export function initWorldBounds() {
    // Build 4 walls around.
    function makeStaticBlock(label, x1, y1, x2, y2) {
        // Matter rectangle() does x/y based on _center_ for some reason
        const w = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);
        const x = Math.min(x1, x2) + w / 2;
        const y = Math.min(y1, y2) + h / 2;
        const initialPos = new Pos(x, y);
        makeEntity({
            initialPos,
            label,
            physics: {
                hull: {
                    type: 'RECT',
                    width: w,
                    height: h,
                },
                isStatic: true
            }
        });
    }
    // The entire world is [0-2000] x [0-3000]
    // Box in that world with boxes of aribitrary size D
    // We double-cover the corners with this.
    const [T, R, B, L] = [0, VWIDTH, VHEIGHT, 0];
    const D = 500;
    // Invisible physics-only blocks surrounding the world.
    makeStaticBlock("left", L - D, T - D, L, B + D);
    makeStaticBlock("right", R, T - D, R + D, B + D);
    makeStaticBlock("top", L - D, T - D, R + D, T);
    makeStaticBlock("bottom", L - D, B, R + D, B + D);
    makeWorldBoundsEntity();
}
export const CONTROL_SIZE = 200;
export function initControlsWidget() {
    const w = CONTROL_SIZE;
    const h = CONTROL_SIZE;
    function makeControlsWidget(control, x) {
        makeEntity({
            label: 'controls_widget',
            initialPos: new Pos(x, h / 2)
        }, {
            type: 'RENDERING',
            payload: {
                type: "CONTROL_BUTTON",
                w,
                controlName: control,
            }
        }, {
            type: 'HITTEST',
            payload: {
                w, h,
                callback: () => activateControlNamed(control)
            }
        });
    }
    makeControlsWidget('GOLF_FORCE', VWIDTH / 2 - w * 2);
    makeControlsWidget('GOLF_VELOCITY', VWIDTH / 2 - w);
    makeControlsWidget('FLAPPY', VWIDTH / 2 + w);
    makeControlsWidget('BALL', VWIDTH / 2 + w * 2);
    makeControlsWidget('ROLL', VWIDTH / 2);
}
