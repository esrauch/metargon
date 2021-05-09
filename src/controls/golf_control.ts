import { ApplyForce, SetVelocity } from "../events/physics.js";
import { bus } from "../bus/bus.js";
import { Pos, Vec } from "../coords/coords.js";
import { VectorControl } from "./vector_control.js";
import { Id, PLAYER } from "../payloads/entity_id.js";
import { CreateEntity, DestroyEntity, SetPosition } from "../events/core_entity_events.js";
import { SetPayload } from "../events/set_payload.js";
import { Control } from "./control.js";

// Classic pull-and-drag "Golf" control: drag and release to apply force to something.
export class GolfControl extends VectorControl {
    private displayEntity?: Id;

    constructor(private type: 'FORCE' | 'VELOCITY' = 'VELOCITY') {
        super();
    }

    enable(): void {
        // When we enable, create a new element that will represent our line.
        // We'll destroy it when we disable.
        if (!this.displayEntity) {
            const createEvt = new CreateEntity(
                "golf_indicator_" + this.type);
            this.displayEntity = createEvt.entityId;
            bus.dispatch(createEvt);
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
        bus.dispatch(new SetPosition(this.displayEntity, pos));
        bus.dispatch(new SetPayload(
            this.displayEntity,
            {
                type: 'RENDERING',
                value: {
                    type: 'LINE',
                    vec
                }
            }));
    }

    private hideDisplayEntity() {
        if (this.displayEntity)
            bus.dispatch(new SetPayload(
                this.displayEntity,
                {
                    type: 'RENDERING',
                    value: undefined,
                }
            ));
    }

    onVectorRelease(_pos: Pos, vec: Vec): void {
        if (this.type == 'FORCE')
            bus.dispatch(new ApplyForce(PLAYER, vec));
        else
            bus.dispatch(new SetVelocity(PLAYER, vec));
        this.hideDisplayEntity();
    }

    onVectorCancel(): void {
        this.hideDisplayEntity();
    }
}