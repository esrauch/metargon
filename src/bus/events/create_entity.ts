import { Pos } from "../../coords/coords.js";
import { makeEntityId } from "../../entity/entity_id.js";
import { EntityRenderingOptions } from "../../rendering/entity_rendering_options.js";


export class CreateEntityEvent {
    readonly type = 'CREATE_ENTITY';
    readonly entityId = makeEntityId();

    constructor(
        readonly label: string,
        readonly initialPos: Pos,
    ) { }
}
