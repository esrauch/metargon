import { Pos } from "../../coords/coords.js";
import { Id } from "../../entity/entity_id.js";
import { EntityRenderingOptions } from "../../rendering/entity_rendering_options.js";
import { bus } from "../bus.js";
import { CreateEntity } from "./core_entity_events.js";
import { EnablePhysics } from "./physics.js";
import { SetRendering } from "./rendering.js";

type MakeEntityArgs = {
    entityId?: Id,
    initialPos: Pos,
    label: string,
    renderingData?: EntityRenderingOptions,
    physicsData?: EntityPhysicsOptions
};

// Utility that dispatches a common bundle of events for making a new entity.
export function makeEntity({
    entityId,
    initialPos,
    label,
    renderingData,
    physicsData
}: MakeEntityArgs): Id {
    const create = new CreateEntity(label, initialPos, entityId);
    const id = create.entityId;
    bus.dispatch(create);
    if (renderingData) bus.dispatch(new SetRendering(id, renderingData));
    if (physicsData) bus.dispatch(new EnablePhysics(id, physicsData));
    return id;
}