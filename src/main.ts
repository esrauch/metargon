import { bus } from "./bus/bus.js";
import { DrawEvent } from "./bus/events/draw.js";
import { TickEvent } from "./bus/events/tick.js";
import { CreateBallControl } from "./controls/create_ball_control.js";
import { FlappyControl } from "./controls/flappy_control.js";
import { GolfControl } from "./controls/golf_control.js";
import { camera } from "./coords/camera.js";
import { idTable } from "./entity/id_table.js";
import { labelTable } from "./entity/label_table.js";
import { positionTable } from "./entity/position_table.js";
import { Gfx2d } from "./gfx/gfx_2d.js";
import { physics } from './physics/physics.js';
import { initPhysicsSandbox } from "./physics_sandbox.js";
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

initPhysicsSandbox();