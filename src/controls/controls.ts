import { input } from "../input/input.js";
import { Control } from "./control.js";
import { CreateBallControl } from "./create_ball_control.js";
import { FlappyControl } from "./flappy_control.js";
import { GolfControl } from "./golf_control.js";
import { RollControl } from "./roll_control.js";

export type ControlName =
    'ROLL' |
    'GOLF_FORCE' | 'GOLF_VELOCITY' | 'FLAPPY' | 'BALL';

const controls = new Map<ControlName, Control>([
    ['GOLF_FORCE', new GolfControl('FORCE')],
    ['GOLF_VELOCITY', new GolfControl('VELOCITY')],
    ['FLAPPY', new FlappyControl()],
    ['BALL', new CreateBallControl()],
    ['ROLL', new RollControl()]
]);

const keyToControl = new Map<string, ControlName>([
    ['1', 'GOLF_FORCE'],
    ['2', 'GOLF_VELOCITY'],
    ['3', 'FLAPPY'],
    ['4', 'BALL'],
    ['5', 'ROLL'],
])

let currentControl: Control | undefined;
let activeControlName: ControlName | undefined;

export function addControlKeyListener() {
    window.addEventListener('keydown', (ev: KeyboardEvent) => {
        const name = keyToControl.get(ev.key);
        if (!name) return;
        activateControlNamed(name);
    })
}

export function activateControlNamed(name: ControlName) {
    const c = controls.get(name);
    if (c) {
        console.log('Activating control', name);
        if (currentControl) currentControl.disable();
        currentControl = c;
        currentControl.enable();
        input.setFallbackInputHandler(currentControl);
        activeControlName = name;
    }
}

export function getActiveControlName() { return activeControlName; }

export { controls };