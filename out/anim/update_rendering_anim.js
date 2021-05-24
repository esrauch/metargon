import { bus } from "../bus/bus.js";
import { SetPayloadEvent } from "../events/payload_events.js";
export class UpdateRenderingAnim {
    constructor(entityId, callback, updateEveryNTicks) {
        this.entityId = entityId;
        this.callback = callback;
        this.updateEveryNTicks = updateEveryNTicks;
        this.tickCount = 0;
        this.updateRendering();
    }
    isDone() {
        return false;
    }
    tick() {
        if (this.tickCount % this.updateEveryNTicks === 0)
            this.updateRendering();
        this.tickCount++;
    }
    updateRendering() {
        const payload = this.callback(this.tickCount);
        if (!payload)
            return;
        bus.dispatch(new SetPayloadEvent(this.entityId, {
            type: 'RENDERING',
            payload
        }), /* spammy */ true);
    }
}
