import { bus } from "../bus/bus.js";
import { CreateEntity } from "./core_entity_events.js";
import { SetPayload } from "./payload_events.js";
// Utility that dispatches a common bundle of events for making a new entity.
export function makeEntity({ entityId, initialPos, label, rendering, physics }, ...otherPayloads) {
    const create = new CreateEntity(label, entityId);
    const id = create.entityId;
    bus.dispatch(create);
    if (initialPos)
        bus.dispatch(new SetPayload(id, {
            type: 'POSITION',
            payload: initialPos,
        }));
    if (rendering)
        bus.dispatch(new SetPayload(id, {
            type: 'RENDERING',
            payload: rendering
        }));
    if (physics)
        bus.dispatch(new SetPayload(id, {
            type: 'PHYSICS',
            payload: physics
        }));
    for (const p of otherPayloads) {
        bus.dispatch(new SetPayload(id, p));
    }
    return id;
}
