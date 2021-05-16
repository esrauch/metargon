import { S00 } from "./00_splash/s00.js";
import { S01 } from "./01_tut1/s01.js";
import { S99 } from "./99_credits/s99.js";
export function getScreenNumber(n) {
    switch (n) {
        case 0:
            return new S00();
        case 1:
            return new S01();
        default:
            return new S99();
    }
}
