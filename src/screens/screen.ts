
export interface ActiveScreen {
    activate: () => void;
    deactivate?: () => void;

    // Called when any fade in animations are done.
    fullyShown?: () => void;
}

import { S00 } from "./00_splash/s00.js";
import { S01 } from "./01_tut1/s01.js";

export function getScreenNumber(n: number): ActiveScreen {
    switch (n) {
        case 0:
            return new S00();
        case 1:
        default:
            return new S01();
    }
}