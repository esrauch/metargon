import { bus } from "./bus/bus.js";
import { Draw} from "./events/draw.js";
import { Tick } from "./events/tick.js";
import { initClickPuzzle } from "./click_puzzle.js";
import { CreateBallControl } from "./controls/create_ball_control.js";
import { FlappyControl } from "./controls/flappy_control.js";
import { GolfControl } from "./controls/golf_control.js";
import { camera } from "./coords/camera.js";
import { idTable } from "./systems/entity/id_table.js";
import { labelTable } from "./systems/entity/label_table.js";
import { positionTable } from "./systems/entity/position_table.js";
import { Gfx2d } from "./gfx/gfx_2d.js";
import { physics } from './systems/physics/physics.js';
import { initPhysicsSandbox } from "./physics_sandbox.js";

import { renderer } from "./systems/rendering/renderer.js";

const canvas = document.querySelector('canvas')!;
const gfx = new Gfx2d(canvas);

const reusableEvents = {
    tick: new Tick(gfx),
    draw: new Draw(gfx),
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
onViewportSizeChange();
window.addEventListener('resize', onViewportSizeChange);

function draw() {
    gfx.clearAndSetTransform();
    bus.dispatch(reusableEvents.draw);
}

function tick() {
    bus.dispatch(reusableEvents.tick);
    draw();
    requestAnimationFrame(tick);
}
tick();

// initPhysicsSandbox();

initClickPuzzle();