import { bus } from "../bus.js";
import { CreateEntity } from "./core_entity_events.js";
import { EnablePhysics } from "./physics.js";
import { SetRendering } from "./rendering.js";
// Utility that dispatches a common bundle of events for making a new entity.
export function makeEntity({ entityId, initialPos, label, renderingData, physicsData }) {
    const create = new CreateEntity(label, initialPos, entityId);
    const id = create.entityId;
    bus.dispatch(create);
    if (renderingData)
        bus.dispatch(new SetRendering(id, renderingData));
    if (physicsData)
        bus.dispatch(new EnablePhysics(id, physicsData));
    return id;
}
