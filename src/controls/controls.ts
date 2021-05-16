import { Control } from "./control.js";
import { CreateBallControl } from "./create_ball_control.js";
import { FlappyControl } from "./flappy_control.js";
import { GolfControl } from "./golf_control.js";
import { RollControl } from "./roll_control.js";

export type ControlName =
    'ROLL' | 'GOLF_FORCE' | 'GOLF_VELOCITY' | 'FLAPPY' | 'BALL';

const controls = new Map<ControlName, Control>([
    ['GOLF_FORCE', new GolfControl('FORCE')],
    ['GOLF_VELOCITY', new GolfControl('VELOCITY')],
    ['FLAPPY', new FlappyControl()],
    ['BALL', new CreateBallControl()],
    ['ROLL', new RollControl()]
]);

const allControls: ControlName[] = [
    'ROLL', 'GOLF_FORCE', 'GOLF_VELOCITY', 'FLAPPY', 'BALL',
];

export { controls, allControls };