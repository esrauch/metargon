import { Id } from "../../entity/entity_id.js";
import { EntityRenderingOptions } from "../../rendering/entity_rendering_options.js";

export class SetRendering {
    readonly type = 'SET_RENDERING'
    constructor(
        readonly entityId: Id,
        // renderingData unset means "clear rendering data"
        readonly renderingData?: EntityRenderingOptions
    ) {}
}