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
}
StatsSystem.singleton = new StatsSystem();
const statsSystem = StatsSystem.singleton;
export { statsSystem };
