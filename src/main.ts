import { bus } from "./bus/bus.js";
import { CreateEntityEvent } from "./bus/events/create_entity.js";
import { DrawEvent } from "./bus/events/draw.js";
import { TickEvent } from "./bus/events/tick.js";
import { CreateBallControl } from "./controls/create_ball_control.js";
import { FlappyControl } from "./controls/flappy_control.js";
import { GolfControl } from "./controls/golf_control.js";
import { camera } from "./coords/camera.js";
import { Pos, VHEIGHT, VWIDTH } from "./coords/coords.js";
import { idTable } from "./entity/id_table.js";
import { labelTable } from "./entity/label_table.js";
import { positionTable } from "./entity/position_table.js";
import { Gfx2d } from "./gfx/gfx_2d.js";
import { physics } from './physics/physics.js';
import { renderer } from "./rendering/renderer.js";

const canvas = document.querySelector('canvas')!;
const gfx = new Gfx2d(canvas);

const reusableEvents = {
    tick: new TickEvent(),
    draw: new DrawEvent(gfx),
};

const controls = new Map<String, Control>([
    ['1', new GolfControl()],
    ['2', new FlappyControl()],
    ['3', new CreateBallControl()]
]);

const singletons = {
    idTable,
    labelTable,
    physics,
    positionTable,
    renderer,
    controls,
}
// Log a bunch of the top level objects so they can be trivially inspected.
console.log(singletons);

bus.addListener(idTable);
bus.addListener(labelTable);
bus.addListener(physics);
bus.addListener(renderer);
bus.addListener(positionTable);

let currentControl: Control | undefined;

window.addEventListener('keydown', (ev: KeyboardEvent) => {
    const c = controls.get(ev.key);
    if (c) {
        console.log('Activating control #', ev.key);
        if (currentControl) currentControl.disable();
        currentControl = c;
        currentControl.enable();
    }
});

function onViewportSizeChange() {
    const swidth = canvas.width = window.innerWidth;
    const sheight = canvas.height = window.innerHeight;
    camera.onViewportSizeChange(swidth, sheight);
    gfx.onViewportSizeChange();
    draw();
}

function draw() {
    gfx.clearAndSetTransform();

    bus.dispatch(reusableEvents.draw);

    // Draw the golf indicator line
    /*
    const [vFrom, vVec] = [control.startPosition, control.vector];
    if (!vFrom || !vVec) return;
    const vTo = add(vFrom, vVec);
    gfx.line(vFrom, vTo);
    */
}

onViewportSizeChange();
window.addEventListener('resize', onViewportSizeChange);

function tick() {
    bus.dispatch(reusableEvents.tick);
    draw();
    requestAnimationFrame(tick);
}

tick();

bus.dispatch(CreateEntityEvent.create({
    initial_pos: new Pos(200, 200),
    label: "ball",
    rendering_data: {
        type: 'CIRCLE',
        radius: 150,
    },
    physics: {
        hull: {
            type: 'CIRCLE',
            radius: 50,
        }
    }
}));

// Build 4 walls around.
function makeStaticBlock(
    label: string,
    x1: number, y1: number, x2: number, y2: number) {
    // Matter rectangle() does x/y based on _center_ for some reason
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    const x = Math.min(x1, x2) + w / 2;
    const y = Math.min(y1, y2) + h / 2;

    return CreateEntityEvent.create({
        initial_pos: new Pos(x, y),
        label,
        rendering_data: {
            type: 'RECT',
            width: w,
            height: h,
        },
        physics: {
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
bus.dispatch(makeStaticBlock("left", L - D, T - D, L, B + D));
bus.dispatch(makeStaticBlock("right", R, T - D, R + D, B + D));
bus.dispatch(makeStaticBlock("top", L - D, T - D, R + D, T));
bus.dispatch(makeStaticBlock("bottom", L - D, B, R + D, B + D));