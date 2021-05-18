import { bus } from "../bus/bus.js";
import { add } from "../coords/coords.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { getCenterPosition } from "../systems/getters.js";
import { easeInOutInterpPos } from "../util/interp.js";
export class CyclicMoveAnimation {
    constructor(entityId, from, to, durationS) {
        this.entityId = entityId;
        this.from = from;
        this.to = to;
        this.tickCount = 0;
        this.tickLength = durationS * 60;
    }
    static ofOffset(entityId, offset, durationS) {
        const currentPos = getCenterPosition(entityId);
        return new CyclicMoveAnimation(entityId, currentPos, add(currentPos, offset), durationS);
    }
    static to(entityId, to, durationS) {
        const currentPos = getCenterPosition(entityId);
        return new CyclicMoveAnimation(entityId, currentPos, to, durationS);
    }
    tick() {
        bus.dispatch(new SetPayloadEvent(this.entityId, {
            type: 'POSITION',
            payload: easeInOutInterpPos(this.from, this.to, this.tickCount / this.tickLength),
        }), /* spammy */ true);
        this.tickCount++;
        if (this.tickCount > this.tickLength) {
            this.tickCount = 0;
            [this.from, this.to] = [this.to, this.from];
        }
    }
}
