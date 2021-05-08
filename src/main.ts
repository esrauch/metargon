import { bus } from "./bus/bus.js";
import { DrawEvent } from "./bus/events/draw.js";
import { makeEntity } from "./bus/events/make_entity_helper.js";
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
    ['1', new GolfControl('FORCE')],
    ['2', new GolfControl('VELOCITY')],
    ['3', new FlappyControl()],
    ['4', new CreateBallControl()]
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

bus.addListeners([
    idTable,
    labelTable,
    physics,
    // Note: posTable *must* come after Physics for the EnablePhysics path,
    // where physics will look up the current location in the posTable, and posTable
    // will drop its knowledge of the position. Possibly we could let the posTable
    // just continue to know the stale position instead?
    positionTable,
    renderer]);


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
}

onViewportSizeChange();
window.addEventListener('resize', onViewportSizeChange);

function tick() {
    bus.dispatch(reusableEvents.tick);
    draw();
    requestAnimationFrame(tick);
}

tick();

makeEntity({
    initialPos: new Pos(200, 200),
    label: "ball",
    renderingData: {
        type: 'CIRCLE',
        radius: 150,
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