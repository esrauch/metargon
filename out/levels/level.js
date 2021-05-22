import { SplashScreen } from "./99_nonlevels/splash.js";
import { Rolling01 } from "./01_rolling/rolling_01.js";
import { Rolling02 } from "./01_rolling/rolling_02.js";
import { Rolling03 } from "./01_rolling/rolling_03.js";
import { Rolling04 } from "./01_rolling/rolling_04.js";
import { Rolling05 } from "./01_rolling/rolling_05.js";
import { BrokenScreen } from "./99_nonlevels/broken.js";
import { FinScreen } from "./99_nonlevels/fin.js";
import { Flapping01 } from "./02_flapping/flapping_01.js";
import { Flapping02 } from "./02_flapping/flapping_02.js";
import { Flapping03 } from "./02_flapping/flapping_03.js";
import { Flapping04 } from "./02_flapping/flapping_04.js";
import { Flapping05 } from "./02_flapping/flapping_05.js";
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
    FinScreen,
];
export function getLevelNumber(n) {
    // return new Flapping05();
    let screenCtor = screens[n];
    return screenCtor ? new screenCtor() : new BrokenScreen();
}
