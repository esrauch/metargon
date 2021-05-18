// A generic control mode where the user drags at an arbitrary point to decide a vector
// that points in the opposite direction.
// For example, a GolfControl uses this to apply a force to a given object.
import { bus } from "../bus/bus.js";
import { delta } from "../coords/coords.js";
import { CreateEntity, DestroyEntity } from "../events/core_entity_events.js";
import { SetPayloadEvent, ClearPayloadEvent } from "../events/payload_events.js";
import { PLAYER } from "../payloads/entity_id.js";
import { Control } from "./control.js";
const minVecLength = 50;
const maxVecLength = 500;
export class VectorControl extends Control {
    constructor() {
        super();
    }
    onDown(pos) {
        this.reset();
        if (pos.isInBounds())
            this.startPosition = pos;
    }
    onMove(pos) {
        if (!this.startPosition)
            return;
        this.vector = delta(this.startPosition, pos).normalizeIfLongerThan(maxVecLength);
        this.onVectorUpdate(this.startPosition, this.vector);
    }
    onUp(pos) {
        if (!this.startPosition)
            return;
        this.vector = delta(this.startPosition, pos).normalizeIfLongerThan(maxVecLength);
        if (this.vector.length() < minVecLength)
            this.onVectorCancel();
        else
            this.onVectorRelease(this.startPosition, this.vector);
        this.reset();
    }
    onCancel() {
        if (this.startPosition && this.vector) {
            this.onVectorCancel();
        }
        this.reset();
    }
    reset() {
        this.startPosition = undefined;
        this.vector = undefined;
    }
}
export class VisibleVectorContol extends VectorControl {
    enable() {
        // When we enable, create a new element that will represent our line.
        // We'll destroy it when we disable.
        if (!this.displayEntity) {
            const createEvt = new CreateEntity('vec_indicator');
            this.displayEntity = createEvt.entityId;
            bus.dispatch(createEvt);
            bus.dispatch(new SetPayloadEvent(this.displayEntity, {
                type: 'POSITION_ATTACHMENT',
                payload: {
                    otherEntity: PLAYER,
                }
            }));
        }
    }
    disable() {
        if (this.displayEntity) {
            bus.dispatch(new DestroyEntity(this.displayEntity));
            this.displayEntity = undefined;
        }
    }
    onVectorUpdate(pos, vec) {
        if (!this.displayEntity)
            return;
        bus.dispatch(new SetPayloadEvent(this.displayEntity, {
            type: 'RENDERING',
            payload: {
                type: 'LINE',
                vec
            }
        }), /*spammy*/ true);
    }
    hideDisplayEntity() {
        if (this.displayEntity)
            bus.dispatch(new ClearPayloadEvent(this.displayEntity, 'RENDERING'));
    }
    onVectorRelease(_pos, vec) {
        this.commit(vec);
        this.hideDisplayEntity();
    }
    onVectorCancel() {
        this.hideDisplayEntity();
    }
}
