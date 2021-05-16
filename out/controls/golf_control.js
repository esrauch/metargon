import { ApplyForce, SetVelocity } from "../events/physics_events.js";
import { bus } from "../bus/bus.js";
import { VectorControl } from "./vector_control.js";
import { PLAYER } from "../payloads/entity_id.js";
import { CreateEntity, DestroyEntity } from "../events/core_entity_events.js";
import { ClearPayloadEvent, SetPayloadEvent } from "../events/payload_events.js";
// Classic pull-and-drag "Golf" control: drag and release to apply force to something.
export class GolfControl extends VectorControl {
    constructor(type = 'VELOCITY') {
        super();
        this.type = type;
    }
    enable() {
        // When we enable, create a new element that will represent our line.
        // We'll destroy it when we disable.
        if (!this.displayEntity) {
            const createEvt = new CreateEntity("golf_indicator_" + this.type);
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
        }));
    }
    hideDisplayEntity() {
        if (this.displayEntity)
            bus.dispatch(new ClearPayloadEvent(this.displayEntity, 'RENDERING'));
    }
    onVectorRelease(_pos, vec) {
        if (this.type == 'FORCE')
            bus.dispatch(new ApplyForce(PLAYER, vec));
        else
            bus.dispatch(new SetVelocity(PLAYER, vec));
        this.hideDisplayEntity();
    }
    onVectorCancel() {
        this.hideDisplayEntity();
    }
}
