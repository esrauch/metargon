import { SplashScreen } from "./99_nonlevels/splash.js";
import { Rolling01 } from "./01_rolling/rolling_01.js";
import { Rolling02 } from "./01_rolling/rolling_02.js";
import { Rolling03 } from "./01_rolling/rolling_03.js";
import { Rolling04 } from "./01_rolling/rolling_04.js";
import { Rolling05 } from "./01_rolling/rolling_05.js";
import { BrokenScreen } from "./99_nonlevels/broken.js";
import { FinScreen } from "./99_nonlevels/fin.js";
import { PlaygroundScreen } from "./99_nonlevels/playground.js";
const screens = [
    SplashScreen,
    Rolling01,
    Rolling02,
    Rolling03,
    Rolling04,
    Rolling05,
    FinScreen,
];
export function getLevelNumber(n) {
    return new PlaygroundScreen();
    let screenCtor = screens[n];
    return screenCtor ? new screenCtor() : new BrokenScreen();
}
