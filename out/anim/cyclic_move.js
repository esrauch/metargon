import { bus } from "../bus/bus.js";
import { add } from "../coords/coords.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { getCenterPosition, isLocked } from "../systems/getters.js";
import { easeInOutInterpPos } from "../util/interp.js";
export class CyclicMoveAnimation {
    constructor(entityId, from, to, durationS, offsetS = 0) {
        this.entityId = entityId;
        this.from = from;
        this.to = to;
        this.tickCount = 0;
        this.tickLength = durationS * 60;
        this.tickCount = (offsetS * 60) % this.tickLength;
    }
    static ofOffset(entityId, offset, durationS, offsetS) {
        const currentPos = getCenterPosition(entityId);
        return new CyclicMoveAnimation(entityId, currentPos, add(currentPos, offset), durationS, offsetS);
    }
    static to(entityId, to, durationS, offsetS) {
        const currentPos = getCenterPosition(entityId);
        return new CyclicMoveAnimation(entityId, currentPos, to, durationS, offsetS);
    }
    isDone() { return false; }
    tick() {
        if (isLocked(this.entityId)) {
            // If it is locked then the animation is paused.
            return;
        }
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
