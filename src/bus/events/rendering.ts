import { Id } from "../../entity/entity_id.js";
import { EntityRenderingOptions } from "../../rendering/entity_rendering_options.js";

export class EnableRendering {
    readonly type = 'ENABLE_RENDERING'
    constructor(
        readonly entityId: Id,
        readonly renderingData: EntityRenderingOptions
    ) {}
}