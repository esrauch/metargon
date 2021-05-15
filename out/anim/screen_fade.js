import { bus } from "../bus/bus.js";
import { linearInterp } from '../util/interp.js';
export function makeFadeScreenAnimation(dir, seconds, temporaryForegroundColor) {
    return new Promise((resolve) => {
        new ScreenFadeAnimation(resolve, dir, seconds, temporaryForegroundColor);
    });
}
class ScreenFadeAnimation {
    constructor(doneCallback, inOut, seconds = 200 / 60, temporaryForegroundColor) {
        this.doneCallback = doneCallback;
        this.inOut = inOut;
        this.temporaryForegroundColor = temporaryForegroundColor;
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
        if (this.temporaryForegroundColor)
            ev.gfx.setForegroundColor(undefined);
        ev.gfx.setGlobalOpacity(this.endAlpha);
        bus.removeListener(this);
        this.doneCallback();
    }
    onEvent(ev) {
        if (ev.type != 'TICK')
            return;
        if (this.tickCount == 0) {
            ev.gfx.setForegroundColor(this.temporaryForegroundColor);
        }
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
