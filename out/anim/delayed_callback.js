import { bus } from "../bus/bus.js";
import { Win } from "../events/win_loss_events.js";
export class DelayedCallback {
    constructor(callback, ticksRemaining) {
        this.callback = callback;
        this.ticksRemaining = ticksRemaining;
    }
    isDone() {
        return this.ticksRemaining < 0;
    }
    tick() {
        this.ticksRemaining--;
        if (this.ticksRemaining === 0)
            this.callback();
    }
}
export class DelayedWin extends DelayedCallback {
    constructor(tickDelay) {
        super(() => bus.dispatch(new Win()), tickDelay);
    }
}
