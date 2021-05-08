import { ApplyForce, SetVelocity } from "../events/physics.js";
import { bus } from "../bus/bus.js";
import { Pos, Vec } from "../coords/coords.js";
import { VectorControl } from "./vector_control.js";
import { Id, PLAYER } from "../systems/entity/entity_id.js";
import { CreateEntity, DestroyEntity, SetPosition } from "../events/core_entity_events.js";
import { SetRendering } from "../events/rendering.js";

// Classic pull-and-drag "Golf" control: drag and release to apply force to something.
export class GolfControl implements Control {
    private vectorControl = new VectorControl(
        (pos, vec) => this.onUpdate(pos, vec),
        (pos, vec) => this.onRelease(pos, vec),
        () => this.onCancel(),
    );

    private displayEntity?: Id;

    constructor(private type: 'FORCE'|'VELOCITY' = 'VELOCITY') {
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

        this.vectorControl.enable();
    }

    disable(): void {
        if (this.displayEntity) {
            bus.dispatch(new DestroyEntity(this.displayEntity));
            this.displayEntity = undefined;
        }
        this.vectorControl.disable();
    }

    onUpdate(pos: Pos, vec: Vec): void {
        if (!this.displayEntity) return;
        bus.dispatch(new SetPosition(this.displayEntity, pos));
        bus.dispatch(new SetRendering(this.displayEntity, {
            type: 'LINE',
            vec
        }));
    }

    onRelease(pos: Pos, vec: Vec): void {
        if (this.type == 'FORCE')
            bus.dispatch(new ApplyForce(PLAYER, vec));
        else
            bus.dispatch(new SetVelocity(PLAYER, vec));

        if (this.displayEntity)
            bus.dispatch(new SetRendering(this.displayEntity));
    }

    onCancel(): void {
    }
}