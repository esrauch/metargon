import { makeEntity } from "./bus/events/make_entity_helper.js";
import { Pos, VWIDTH, VHEIGHT } from "./coords/coords.js";
import { PLAYER } from "./entity/entity_id.js";

export function initPhysicsSandbox() {

    makeEntity({
        entityId: PLAYER,
        initialPos: new Pos(200, 200),
        label: "player",
        renderingData: {
            type: 'CIRCLE',
            radius: 25,
        },
        physicsData: {
            hull: {
                type: 'CIRCLE',
                radius: 50,
            }
        }
    });

    // Build 4 walls around.
    function makeStaticBlock(
        label: string,
        x1: number, y1: number, x2: number, y2: number) {
        // Matter rectangle() does x/y based on _center_ for some reason
        const w = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);
        const x = Math.min(x1, x2) + w / 2;
        const y = Math.min(y1, y2) + h / 2;

        makeEntity({
            initialPos: new Pos(x, y),
            label,
            renderingData: {
                type: 'RECT',
                width: w,
                height: h,
            },
            physicsData: {
                hull: {
                    type: 'RECT',
                    width: w,
                    height: h,
                },
                static: true,
            }
        });
    }

    // The entire world is [0-2000] x [0-3000]
    // Box in that world with boxes of aribitrary size D
    // We double-cover the corners with this.
    const [T, R, B, L] = [0, VWIDTH, VHEIGHT, 0];
    const D = 500;
    makeStaticBlock("left", L - D, T - D, L, B + D);
    makeStaticBlock("right", R, T - D, R + D, B + D);
    makeStaticBlock("top", L - D, T - D, R + D, T);
    makeStaticBlock("bottom", L - D, B, R + D, B + D);
}