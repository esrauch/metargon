export class StatsSystem {
    constructor() {
        this.winCount = 0;
        this.lossCount = 0;
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'WIN':
                this.winCount++;
                break;
            case 'LOSE':
                this.lossCount++;
                break;
            case 'SCREEN_FULLY_SHOWN':
                if (!this.startTime)
                    this.startTime = performance.now();
        }
    }
    get formattedTimeSinceStart() {
        const s = Math.round((performance.now() - (statsSystem.startTime || 0)) / 1000);
        const timeMin = Math.floor(s / 60);
        let timeS = `${s - timeMin * 60}`;
        if (timeS.length < 2)
            timeS = '0' + timeS;
        return `${timeMin}:${timeS}`;
    }
}
StatsSystem.singleton = new StatsSystem();
const statsSystem = StatsSystem.singleton;
export { statsSystem };
