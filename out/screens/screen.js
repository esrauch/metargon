import { SplashScreen } from "./00_splash/splash.js";
import { Rolling01 } from "./01_rolling/rolling_01.js";
import { Rolling02 } from "./01_rolling/rolling_02.js";
import { Rolling03 } from "./01_rolling/rolling_03.js";
import { FinScreen } from "./99_credits/fin.js";
const screens = [
    SplashScreen,
    Rolling01,
    Rolling02,
    Rolling03,
    FinScreen,
];
export function getScreenNumber(n) {
    /*switch (n) {
        case 0:
            return new S00();
        case 1:
            return new S01();
        case 2:
            return new S02();
        default:
            return new S99();
    }*/
    return new Rolling03();
}
