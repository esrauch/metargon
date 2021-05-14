import { input } from "../input/input.js";
import { CreateBallControl } from "./create_ball_control.js";
import { FlappyControl } from "./flappy_control.js";
import { GolfControl } from "./golf_control.js";
import { RollControl } from "./roll_control.js";
const controls = new Map([
    ['GOLF_FORCE', new GolfControl('FORCE')],
    ['GOLF_VELOCITY', new GolfControl('VELOCITY')],
    ['FLAPPY', new FlappyControl()],
    ['BALL', new CreateBallControl()],
    ['ROLL', new RollControl()]
]);
const keyToControl = new Map([
    ['1', 'GOLF_FORCE'],
    ['2', 'GOLF_VELOCITY'],
    ['3', 'FLAPPY'],
    ['4', 'BALL'],
    ['5', 'ROLL'],
]);
let currentControl;
let activeControlName;
export function addControlKeyListener() {
    window.addEventListener('keydown', (ev) => {
        const name = keyToControl.get(ev.key);
        if (!name)
            return;
        activateControlNamed(name);
    });
}
export function activateNullControl() {
    currentControl === null || currentControl === void 0 ? void 0 : currentControl.disable();
    input.setFallbackInputHandler(undefined);
    currentControl = undefined;
    activeControlName = undefined;
}
export function activateControlNamed(name) {
    const c = controls.get(name);
    if (c) {
        console.log('Activating control', name);
        currentControl === null || currentControl === void 0 ? void 0 : currentControl.disable();
        currentControl = c;
        currentControl.enable();
        input.setFallbackInputHandler(currentControl);
        activeControlName = name;
    }
}
export function getActiveControlName() { return activeControlName; }
export { controls };
