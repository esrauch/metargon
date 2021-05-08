import { Pos } from "../../coords/coords.js";
import { Id } from "../../entity/entity_id.js";
import { EntityRenderingOptions } from "../../rendering/entity_rendering_options.js";
import { bus } from "../bus.js";
import { CreateEntityEvent } from "./create_entity.js";
import { EnablePhysics } from "./physics.js";
import { EnableRendering } from "./rendering.js";

type MakeEntityArgs = {
    initialPos: Pos,
    label: string,
    renderingData?: EntityRenderingOptions,
    physicsData?: EntityPhysicsOptions
};

// Utility that dispatches a common bundle of events for making a new entity.
export function makeEntity({
    initialPos,
    label,
    renderingData,
    physicsData
}: MakeEntityArgs): Id {
    const create = new CreateEntityEvent(label, initialPos);
    const id = create.entityId;
    bus.dispatch(create);
    if (renderingData) bus.dispatch(new EnableRendering(id, renderingData));
    if (physicsData) bus.dispatch(new EnablePhysics(id, physicsData));
    return id;
}