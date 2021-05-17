import { bus } from "../bus/bus.js";
import { linearInterp } from '../util/interp.js';
export function makeFadeScreenAnimation(dir, seconds, temporaryForegroundColor) {
    return new Promise((resolve) => {
        new ScreenFadeAnimation(resolve, dir, seconds, temporaryForegroundColor);
    });
}
// TODO: Change this to be like CyclicMoveAnimation and have
// the ticks are explicit from ScreenSystem instead of via BusListener
// and promises (also to let us cancel this)
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
            ev.gfx.forceForegroundColor(undefined);
        ev.gfx.setGlobalOpacity(this.endAlpha);
        bus.removeListener(this);
        this.doneCallback();
    }
    onEvent(ev) {
        if (ev.type != 'TICK')
            return;
        if (this.tickCount == 0) {
            ev.gfx.forceForegroundColor(this.temporaryForegroundColor);
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
