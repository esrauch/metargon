import { ShotControl } from "./shot_control.js";
import { CreateBallControl } from "./create_ball_control.js";
import { FlappyControl } from "./flappy_control.js";
import { GolfControl } from "./golf_control.js";
import { RollControl } from "./roll_control.js";
const controls = new Map([
    ['GOLF', new GolfControl()],
    ['FLAPPY', new FlappyControl()],
    ['BALL', new CreateBallControl()],
    ['ROLL', new RollControl()],
    ['SHOT', new ShotControl()],
]);
const allControls = Array.from(controls.keys());
export { controls, allControls };
