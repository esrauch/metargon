import { ShotControl } from "./shot_control.js";
import { FlapControl } from "./flappy_control.js";
import { RollControl } from "./roll_control.js";
import { MagnetControl } from "./magnet_control.js";
import { LockControl } from "./lock_control.js";
const controls = new Map([
    // ['GOLF', new GolfControl()],
    ['FLAP', new FlapControl()],
    //['BALL', new CreateBallControl()],
    ['ROLL', new RollControl()],
    ['SHOT', new ShotControl()],
    ['MAG', new MagnetControl()],
    ['LOCK', new LockControl()],
]);
const allControls = Array.from(controls.keys());
export { controls, allControls };
