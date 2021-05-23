import { ShotControl } from "./shot_control.js";
import { Control } from "./control.js";
import { CreateBallControl } from "./create_ball_control.js";
import { FlapControl } from "./flappy_control.js";
import { GolfControl } from "./golf_control.js";
import { RollControl } from "./roll_control.js";
import { MagnetControl } from "./magnet_control.js";
import { LockControl } from "./lock_control.js";

export type ControlName =
    'ROLL' | 'GOLF' | 'FLAP' | 'BALL' | 'SHOT' | 'MAG' | 'LOCK';

const controls = new Map<ControlName, Control>([
    ['GOLF', new GolfControl()],
    ['FLAP', new FlapControl()],
    ['BALL', new CreateBallControl()],
    ['ROLL', new RollControl()],
    ['SHOT', new ShotControl()],
    ['MAG', new MagnetControl()],
    ['LOCK', new LockControl()],
]);

const allControls: ControlName[] = Array.from(controls.keys());

export { controls, allControls };