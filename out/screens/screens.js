import { S00 } from "./00_splash/s00.js";
import { S01 } from "./01_tut1/s01.js";
export function getScreenNumber(n) {
    switch (n) {
        case 0:
        default:
            return new S00();
        case 1:
            return new S01();
    }
}
