import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { Tick } from "../events/tick_event.js";
import { Color } from "../gfx/gfx.js";
import { linearInterp } from '../util/interp.js';

export type Direction = 'IN'|'OUT';

export function makeFadeScreenAnimation(
    dir: Direction,
    seconds: number,
    temporaryForegroundColor?: Color,
): Promise<void> {
    return new Promise((resolve) => {
        new ScreenFadeAnimation(
            resolve,
            dir,
            seconds,
            temporaryForegroundColor
        )
    })
}

// TODO: Change this to be like CyclicMoveAnimation and have
// the ticks are explicit from ScreenSystem instead of via BusListener
// and promises (also to let us cancel this)
class ScreenFadeAnimation implements BusListener {
    private tickCount = 0;
    private readonly tickDuration: number;
    private startAlpha: number;
    private endAlpha: number;
    constructor(
        readonly doneCallback: () => void,
        readonly inOut: 'IN'|'OUT',
        seconds: number = 200 / 60,
        readonly temporaryForegroundColor?: string) {
        this.tickDuration = seconds * 60;
        if (inOut == 'IN') {
            this.startAlpha = 0;
            this.endAlpha = 1;
        } else {
            this.startAlpha = 1;
            this.endAlpha = 0;
        }
        bus.addListener(this);
    }

    private end(ev: Tick) {
        if (this.temporaryForegroundColor) ev.gfx.forceForegroundColor(undefined);
        ev.gfx.setGlobalOpacity(this.endAlpha);
        bus.removeListener(this);
        this.doneCallback();
    }

    onEvent(ev: BusEvent): void {
        if (ev.type != 'TICK') return;
        if (this.tickCount == 0) {
            ev.gfx.forceForegroundColor(this.temporaryForegroundColor)
        }
        if (this.tickCount >= this.tickDuration) {
            this.end(ev);
        } else {
            const amt = this.tickCount / this.tickDuration;
            const start = this.startAlpha;
            const end = this.endAlpha;
            ev.gfx.setGlobalOpacity(linearInterp(start, end, amt));
        }
        this.tickCount++;
    }
}