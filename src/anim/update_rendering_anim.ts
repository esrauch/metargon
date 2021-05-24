import { bus } from "../bus/bus.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { Id } from "../payloads/entity_id.js";
import { RenderingPayload } from "../payloads/rendering_payload.js";
import { Anim } from "./animation.js";


export class UpdateRenderingAnim implements Anim {
    private tickCount = 0;
    constructor(
        readonly entityId: Id,
        readonly callback: (tickCount: number) => RenderingPayload|undefined,
        readonly updateEveryNTicks: number) {
            this.updateRendering();
        }

    isDone(): boolean {
        return false;
    }

    tick(): void {
        if (this.tickCount % this.updateEveryNTicks === 0)
            this.updateRendering();
        this.tickCount++;
    }

    private updateRendering() {
        const payload = this.callback(this.tickCount);
        if (!payload) return;
        bus.dispatch(new SetPayloadEvent(this.entityId, {
            type: 'RENDERING',
            payload
        }), /* spammy */ true)
    }
}