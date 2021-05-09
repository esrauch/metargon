import { bus } from "./bus/bus.js";
import { Draw} from "./events/draw.js";
import { Tick } from "./events/tick.js";
import { camera } from "./coords/camera.js";
import { Gfx2d } from "./gfx/gfx_2d.js";
import { physics } from './systems/physics/physics.js';
import { initPhysicsSandbox } from "./physics_sandbox.js";
import { renderer } from "./systems/renderer.js";
import { coreTable } from "./systems/core_table.js";
import { genericPayloadTable } from "./systems/generic_payload_table.js";
import { addControlKeyListener, controls } from "./controls/controls.js";
import {input} from './input/input.js';

const canvas = document.querySelector('canvas')!;
const gfx = new Gfx2d(canvas);

const reusableEvents = {
    tick: new Tick(gfx),
    draw: new Draw(gfx),
};

addControlKeyListener();

// Log a bunch of the top level objects so they can be trivially inspected.
console.log({
    coreTable,
    physics,
    renderer,
    controls,
    genericPayloadTable,
    input,
});

input.enable();

bus.addListeners([
    coreTable,
    genericPayloadTable,
    physics,
    renderer,
]);

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

initPhysicsSandbox();

// initClickPuzzle();