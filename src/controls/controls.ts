import { input } from "../input/input.js";
import { Control } from "./control.js";
import { CreateBallControl } from "./create_ball_control.js";
import { FlappyControl } from "./flappy_control.js";
import { GolfControl } from "./golf_control.js";

const controls = new Map<String, Control>([
    ['1', new GolfControl('FORCE')],
    ['2', new GolfControl('VELOCITY')],
    ['3', new FlappyControl()],
    ['4', new CreateBallControl()]
]);

let currentControl: Control | undefined;

export function addControlKeyListener() {
    window.addEventListener('keydown', (ev: KeyboardEvent) => {
        const c = controls.get(ev.key);
        if (c) {
            console.log('Activating control #', ev.key);
            if (currentControl) currentControl.disable();
            currentControl = c;
            currentControl.enable();
            input.setFallbackInputHandler(currentControl);
        }
    });
}

export {controls};