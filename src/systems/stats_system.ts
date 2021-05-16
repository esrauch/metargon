import { BusEvent } from "../bus/bus.js";


export class StatsSystem {
    private constructor() {}
    static singleton = new StatsSystem();

    winCount = 0;
    lossCount = 0;

    // Starttime kicks off once the splash screen is faded in.
    startTime?: number;

    onEvent(ev: BusEvent) {
        switch (ev.type) {
            case 'WIN': this.winCount++; break;
            case 'LOSE': this.lossCount++; break;
            case 'SCREEN_FULLY_SHOWN':
                if (!this.startTime) this.startTime = performance.now();
        }
    }
}

const statsSystem = StatsSystem.singleton;
export {statsSystem};