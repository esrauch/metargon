import { bus } from "../bus/bus.js";
import { Win } from "../events/win_loss_events.js";
import { Anim } from "./animation.js";


export class DelayedCallback implements Anim {
    constructor(
        readonly callback: () => void,
        private ticksRemaining: number,
    ) {}

    isDone(): boolean {
        return this.ticksRemaining < 0;
    }

    tick(): void {
        this.ticksRemaining--;
        if (this.ticksRemaining === 0) this.callback();
    }

}

export class DelayedWin extends DelayedCallback {
    constructor(tickDelay: number) {
        super(
            () => bus.dispatch(new Win()),
            tickDelay
        )
    }
}