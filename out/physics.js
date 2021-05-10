/// <reference types="./matter" />
import { VHEIGHT, VWIDTH, VPositions } from "./coords/coords.js";
// Importing a js module with typings is incredibly difficult for some reason.
// Matter should be loaded as a module, but instead we just
// load it into the global namespace in index.html.
const M = window.Matter;
const STEP = 1000 / 60;
function makeStaticBlock(label, x1, y1, x2, y2) {
    // Matter rectangle() does x/y based on _center_ for some reason
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    const x = Math.min(x1, x2) + w / 2;
    const y = Math.min(y1, y2) + h / 2;
    return M.Bodies.rectangle(x, y, w, h, { isStatic: true, label });
}
export class Physics {
    constructor() {
        const engine = this.engine = M.Engine.create({
            gravity: {
                y: 5,
            }
        });
        console.log(engine);
        const ball = M.Bodies.circle(200, 200, 100, {
            label: "ball",
            restitution: 0.8
        });
        // The entire world is [0-200] x [0-300]
        // Box in that world with boxes of aribitrary size D
        // We double-cover the corners with this.
        const [T, R, B, L] = [0, VWIDTH, VHEIGHT, 0];
        const D = 500;
        const left = makeStaticBlock("left", L - D, T - D, L, B + D);
        const right = makeStaticBlock("right", R, T - D, R + D, B + D);
        const top = makeStaticBlock("top", L - D, T - D, R + D, T);
        const bottom = makeStaticBlock("bottom", L - D, B, R + D, B + D);
        M.Composite.add(engine.world, ball);
        M.Composite.add(engine.world, [left, right, top, bottom]);
    }
    step() {
        M.Engine.update(this.engine, STEP);
    }
    draw(gfx) {
        for (const b of M.Composite.allBodies(this.engine.world)) {
            gfx.filledpoly(new VPositions(b.vertices.map(v => [v.x, v.y])));
        }
    }
}
