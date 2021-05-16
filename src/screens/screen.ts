import { screenSystem } from "../systems/screen_system.js";
import { SplashScreen } from "./00_splash/splash.js";
import { Rolling01 } from "./01_rolling/rolling_01.js";
import { Rolling02 } from "./01_rolling/rolling_02.js";
import { Rolling03 } from "./01_rolling/rolling_03.js";
import { BrokenScreen } from "./99_credits/broken.js";
import { FinScreen } from "./99_credits/fin.js";

export interface ActiveScreen {
    activate: () => void;
    deactivate: () => void;
}

const screens: (new() => ActiveScreen)[] = [
    SplashScreen,
    Rolling01,
    Rolling02,
    Rolling03,
    FinScreen,
]

export function getScreenNumber(n: number): ActiveScreen {
    let screenCtor = screens[n];
    return screenCtor ? new screenCtor() : new BrokenScreen();
    //return new Rolling03();
}