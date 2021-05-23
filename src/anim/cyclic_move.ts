import { bus } from "../bus/bus.js";
import { add, Pos, Vec } from "../coords/coords.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { Id } from "../payloads/entity_id.js";
import { genericPayloadTable } from "../systems/generic_payload_table.js";
import { getCenterPosition, isLocked } from "../systems/getters.js";
import { easeInOutInterpPos } from "../util/interp.js";


export class CyclicMoveAnimation {
    private tickCount = 0;
    private tickLength: number;

    constructor(
        readonly entityId: Id,
        private from: Pos,
        private to: Pos,
        durationS: number,
        offsetS: number = 0) {
        this.tickLength = durationS * 60;
        this.tickCount = (offsetS * 60) % this.tickLength;
    }

    static ofOffset(entityId: Id, offset: Vec, durationS: number, offsetS?:number) {
        const currentPos = getCenterPosition(entityId);
        return new CyclicMoveAnimation(entityId, currentPos, add(currentPos, offset), durationS, offsetS);
    }

    static to(entityId: Id, to: Pos, durationS: number, offsetS?: number): CyclicMoveAnimation {
        const currentPos = getCenterPosition(entityId);
        return new CyclicMoveAnimation(entityId, currentPos, to, durationS, offsetS);
    }

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