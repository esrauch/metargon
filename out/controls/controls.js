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
const allControls = [
    'ROLL', 'GOLF_FORCE', 'GOLF_VELOCITY', 'FLAPPY', 'BALL',
];
export { controls, allControls };
