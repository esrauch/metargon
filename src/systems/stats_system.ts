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

    get formattedTimeSinceStart(): string {
        const s = Math.round((performance.now() - (statsSystem.startTime||0)) / 1000);
        const timeMin = Math.floor(s / 60);
        let timeS = `${s - timeMin*60}`;
        if (timeS.length < 2) timeS = '0' + timeS;
        return `${timeMin}:${timeS}`;
    }
}

const statsSystem = StatsSystem.singleton;
export {statsSystem};