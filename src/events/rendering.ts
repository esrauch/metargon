import { Id } from "../systems/entity/entity_id.js";
import { EntityRenderingState } from "../systems/rendering/entity_rendering_state.js";

export class SetRendering {
    readonly type = 'SET_RENDERING'
    constructor(
        readonly entityId: Id,
        // renderingData unset means "clear rendering data"
        readonly renderingData?: EntityRenderingState
    ) {}
}