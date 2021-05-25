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
export class DelayedDestroy extends DelayedCallback {
    constructor(entityId, tickDelay) {
        super(() => bus.dispatch(new DestroyEntity(this.entityId)), tickDelay);
        this.entityId = entityId;
    }
}
export class DelayedSetPayload extends DelayedCallback {
    constructor(entityId, typedPayload, tickDelay) {
        super(() => bus.dispatch(new SetPayloadEvent(this.entityId, this.typedPayload)), tickDelay);
        this.entityId = entityId;
        this.typedPayload = typedPayload;
    }
}
