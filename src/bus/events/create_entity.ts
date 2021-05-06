import { Pos } from "../../coords/coords.js";
import { makeEntityId } from "../../entity/entity_id.js";
import { EntityRenderingOptions } from "../../rendering/entity_rendering_options.js";


export class CreateEntityEvent {
    readonly type = 'CREATE_ENTITY';
    readonly entityId = makeEntityId();

    constructor(
        readonly initial_pos: Pos,
        readonly label: string,
        readonly rendering_data?: EntityRenderingOptions,
        readonly physics?: EntityPhysicsOptions
    ) { }

    static create(data: {
        initial_pos: Pos,
        label: string,
        rendering_data?: EntityRenderingOptions,
        physics?: EntityPhysicsOptions  
    }): CreateEntityEvent {
        return new CreateEntityEvent(
            data.initial_pos, data.label, data.rendering_data, data.physics);
    }
}