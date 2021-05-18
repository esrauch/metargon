import { bus } from "../bus/bus.js";
import { add, Pos, Vec } from "../coords/coords.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { Id } from "../payloads/entity_id.js";
import { getCenterPosition } from "../systems/getters.js";
import { easeInOutInterpPos, linearInterpPos } from "../util/interp.js";


export class CyclicMoveAnimation {
    private tickCount = 0;
    private tickLength: number;

    constructor(
        readonly entityId: Id,
        private from: Pos,
        private to: Pos,
        durationS: number) {
        this.tickLength = durationS * 60;
    }

    static ofOffset(entityId: Id, offset: Vec, durationS: number) {
        const currentPos = getCenterPosition(entityId);
        return new CyclicMoveAnimation(entityId, currentPos, add(currentPos, offset), durationS);
    }

    static to(entityId: Id, to: Pos, durationS: number): CyclicMoveAnimation {
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