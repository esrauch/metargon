import { SplashScreen } from "./99_nonlevels/splash.js";
import { Rolling01 } from "./01_roll/roll_01.js";
import { Rolling02 } from "./01_roll/roll_02.js";
import { Rolling03 } from "./01_roll/roll_03.js";
import { Rolling04 } from "./01_roll/roll_04.js";
import { Rolling05 } from "./01_roll/roll_05.js";
import { BrokenScreen } from "./99_nonlevels/broken.js";
import { FinScreen } from "./99_nonlevels/fin.js";
import { Flapping01 } from "./02_flap/flap_01.js";
import { Flapping02 } from "./02_flap/flap_02.js";
import { Flapping03 } from "./02_flap/flap_03.js";
import { Flapping04 } from "./02_flap/flap_04.js";
import { Flapping05 } from "./02_flap/flap_05.js";
import { Shot01 } from "./03_shot/shot_01.js";
import { Shot02 } from "./03_shot/shot_02.js";
import { Shot04 } from "./03_shot/shot_04.js";
import { Shot03 } from "./03_shot/shot_03.js";
import { Mag01 } from "./04_mag/mag_01.js";
import { Mag02 } from "./04_mag/mag_02.js";
import { Lock01 } from "./05_lock/lock_01.js";
import { Lock02 } from "./05_lock/lock_02.js";
import { Lock03 } from "./05_lock/lock_03.js";
const screens = [
    SplashScreen,
    Rolling01,
    Rolling02,
    Rolling03,
    Rolling04,
    Rolling05,
    Flapping01,
    Flapping02,
    Flapping03,
    Flapping04,
    Flapping05,
    Shot01,
    Shot02,
    Shot03,
    Shot04,
    Mag01,
    Mag02,
    Lock01,
    Lock02,
    Lock03,
    FinScreen,
];
export function getLevelNumber(n) {
    let screenCtor = screens[n];
    return screenCtor ? new screenCtor() : new BrokenScreen();
}
