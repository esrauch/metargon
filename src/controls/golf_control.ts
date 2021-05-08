import { ApplyForceEvent, SetVelocityEvent } from "../bus/events/physics.js";
import { bus } from "../bus/bus.js";
import { add, Pos, Vec } from "../coords/coords.js";
import { VectorControl } from "./vector_control.js";
import { Id } from "../entity/entity_id.js";
import { DestroyEntityEvent } from "../bus/events/destroy_entity.js";
import { CreateEntityEvent } from "../bus/events/create_entity.js";
import { Gfx } from "../gfx/gfx.js";
import { EntityRenderingOptions } from "../rendering/entity_rendering_options.js";
import { EnableRendering } from "../bus/events/rendering.js";

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
            const createEvt = new CreateEntityEvent(
                "golf_indicator_" + this.type,
                new Pos(0, 0),
            );
            this.displayEntity = createEvt.entityId;
            bus.dispatch(createEvt);

            bus.dispatch(new EnableRendering(this.displayEntity,
                {
                    type: 'CUSTOM',
                    draw: (gfx) => this.draw(gfx)
                }))
        }

        this.vectorControl.enable();
    }

    disable(): void {
        if (this.displayEntity) {
            bus.dispatch(new DestroyEntityEvent(this.displayEntity));
            this.displayEntity = undefined;
        }
        this.vectorControl.disable();
    }

    onUpdate(pos: Pos, vec: Vec): void {
    }

    onRelease(pos: Pos, vec: Vec): void {
        if (this.type == 'FORCE') {
            bus.dispatch(new ApplyForceEvent(1, vec));
        } else {
            bus.dispatch(new SetVelocityEvent(1, vec));
        }
    }

    onCancel(): void {
    }

    draw(gfx: Gfx): void {
        const from = this.vectorControl.startPosition
        const vec = this.vectorControl.vector;
        if (from && vec)
            gfx.vector(from, vec);
    }
}