import { ApplyForce, SetVelocity } from "../events/physics_events.js";
import { bus } from "../bus/bus.js";
import { Pos, Vec } from "../coords/coords.js";
import { VectorControl } from "./vector_control.js";
import { Id, PLAYER } from "../payloads/entity_id.js";
import { CreateEntity, DestroyEntity } from "../events/core_entity_events.js";
import { ClearPayloadEvent, SetPayloadEvent } from "../events/payload_events.js";

// Classic pull-and-drag "Golf" control: drag and release to apply force to something.
export class GolfControl extends VectorControl {
    private displayEntity?: Id;

    enable(): void {
        // When we enable, create a new element that will represent our line.
        // We'll destroy it when we disable.
        if (!this.displayEntity) {
            const createEvt = new CreateEntity('golf_indicator');
            this.displayEntity = createEvt.entityId;
            bus.dispatch(createEvt);
            bus.dispatch(new SetPayloadEvent(this.displayEntity, {
                type: 'POSITION_ATTACHMENT',
                payload: {
                    otherEntity: PLAYER,
                }
            }))
        }
    }

    disable(): void {
        if (this.displayEntity) {
            bus.dispatch(new DestroyEntity(this.displayEntity));
            this.displayEntity = undefined;
        }
    }

    onVectorUpdate(pos: Pos, vec: Vec): void {
        if (!this.displayEntity) return;
        bus.dispatch(new SetPayloadEvent(
            this.displayEntity,
            {
                type: 'RENDERING',
                payload: {
                    type: 'LINE',
                    vec
                }
            }));
    }

    private hideDisplayEntity() {
        if (this.displayEntity)
            bus.dispatch(new ClearPayloadEvent(this.displayEntity, 'RENDERING'));
    }

    onVectorRelease(_pos: Pos, vec: Vec): void {
        bus.dispatch(new SetVelocity(PLAYER, vec));
        this.hideDisplayEntity();
    }

    onVectorCancel(): void {
        this.hideDisplayEntity();
    }
}