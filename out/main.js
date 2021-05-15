import { bus } from "./bus/bus.js";
import { Draw } from "./events/draw.js";
import { Tick } from "./events/tick.js";
import { camera } from "./coords/camera.js";
import { Gfx2d } from "./gfx/gfx_2d.js";
import { addControlKeyListener, controls } from "./controls/controls.js";
import { input } from './input/input.js';
import { allSystems } from "./systems/all_systems.js";
import { crossFadeScreen } from "./screens/screen.js";
import { getScreenNumber } from "./screens/screens.js";
const canvas = document.querySelector('canvas');
const gfx = new Gfx2d(canvas);
const reusableEvents = {
    tick: new Tick(gfx),
    draw: new Draw(gfx),
};
addControlKeyListener();
// Log a bunch of the top level objects so they can be trivially inspected.
console.log({
    systems: allSystems,
    controls,
    input,
    bus,
});
input.enable();
bus.addListeners(allSystems);
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
crossFadeScreen(getScreenNumber(0));
