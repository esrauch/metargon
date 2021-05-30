import { bus } from "../bus/bus.js";
import { DestroyEntity } from "../events/core_entity_events.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { Win } from "../events/win_loss_events.js";
class DelayedCallback {
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
export class DelayedEntitySpecificCallback extends DelayedCallback {
    constructor(entityId, cb, tickDelay) {
        super(cb, tickDelay);
        this.entityId = entityId;
    }
}
export class DelayedDestroy extends DelayedEntitySpecificCallback {
    constructor(entityId, tickDelay) {
        super(entityId, () => bus.dispatch(new DestroyEntity(this.entityId)), tickDelay);
    }
}
export class DelayedSetPayload extends DelayedEntitySpecificCallback {
    constructor(entityId, typedPayload, tickDelay) {
        super(entityId, () => bus.dispatch(new SetPayloadEvent(this.entityId, this.typedPayload)), tickDelay);
        this.typedPayload = typedPayload;
    }
}
