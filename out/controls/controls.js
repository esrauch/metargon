import { ShotControl } from "./shot_control.js";
import { FlapControl } from "./flappy_control.js";
import { RollControl } from "./roll_control.js";
import { MagnetControl } from "./magnet_control.js";
import { LockControl } from "./lock_control.js";
import { TiltGravityControl } from "./tilt_control.js";
import { GolfControl } from "./golf_control.js";
import { CreateBallControl } from "./create_ball_control.js";
export const controls = new Map([
    ['GOLF', new GolfControl()],
    ['FLAP', new FlapControl()],
    ['BALL', new CreateBallControl()],
    ['ROLL', new RollControl()],
    ['SHOT', new ShotControl()],
    ['MAG', new MagnetControl()],
    ['LOCK', new LockControl()],
    ['TILT', new TiltGravityControl()],
]);
export const allControls = Array.from(controls.keys());
