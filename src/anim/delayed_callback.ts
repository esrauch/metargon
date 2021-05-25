import { bus } from "../bus/bus.js";
import { DestroyEntity } from "../events/core_entity_events.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { Win } from "../events/win_loss_events.js";
import { Id } from "../payloads/entity_id.js";
import { SomeTypedPayload } from "../payloads/payload.js";
import { Anim } from "./animation.js";


class DelayedCallback implements Anim {
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

export class DelayedDestroy extends DelayedCallback {
    constructor(readonly entityId: Id, tickDelay: number) {
        super(
            () => bus.dispatch(new DestroyEntity(this.entityId)),
            tickDelay
        );
    }
}

export class DelayedSetPayload extends DelayedCallback {
    constructor(readonly entityId: Id, readonly typedPayload: SomeTypedPayload, tickDelay: number) {
        super(
            () => bus.dispatch(new SetPayloadEvent(this.entityId, this.typedPayload)),
            tickDelay
        );
    }
}