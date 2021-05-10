import { bus } from "../bus/bus.js";
import { linearInterp } from '../util/interp.js';
export function fadeScreen(dir, seconds) {
    return new Promise((resolve) => {
        new ScreenFade(resolve, dir, seconds);
    });
}
class ScreenFade {
    constructor(doneCallback, inOut, seconds = 200 / 60) {
        this.doneCallback = doneCallback;
        this.inOut = inOut;
        this.tickCount = 0;
        this.tickDuration = seconds * 60;
        if (inOut == 'IN') {
            this.startAlpha = 0;
            this.endAlpha = 1;
        }
        else {
            this.startAlpha = 1;
            this.endAlpha = 0;
        }
        bus.addListener(this);
    }
    end(ev) {
        ev.gfx.setGlobalOpacity(this.endAlpha);
        bus.removeListener(this);
        this.doneCallback();
    }
    onEvent(ev) {
        if (ev.type != 'TICK')
            return;
        if (this.tickCount >= this.tickDuration) {
            this.end(ev);
        }
        else {
            const amt = this.tickCount / this.tickDuration;
            const start = this.startAlpha;
            const end = this.endAlpha;
            ev.gfx.setGlobalOpacity(linearInterp(start, end, amt));
        }
        this.tickCount++;
    }
}
