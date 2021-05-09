import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { Tick } from "../events/tick.js";
import { linearInterp } from '../util/interp.js';

export type Direction = 'IN'|'OUT';

export function fadeScreen(
    dir: Direction,
    seconds: number
): Promise<void> {
    return new Promise((resolve) => {
        new ScreenFade(
            resolve,
            dir,
            seconds
        )
    })
}

class ScreenFade implements BusListener {
    private tickCount = 0;
    private readonly tickDuration: number;
    private startAlpha: number;
    private endAlpha: number;
    constructor(
        readonly doneCallback: () => void,
        readonly inOut: 'IN'|'OUT',
        seconds: number = 200 / 60) {
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

    end(ev: Tick) {
        ev.gfx.setGlobalOpacity(this.endAlpha);
        bus.removeListener(this);
        this.doneCallback();
    }

    onEvent(ev: BusEvent): void {
        if (ev.type != 'TICK') return;
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