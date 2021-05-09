import { Pos } from "../coords/coords.js";
import { Id } from "../payloads/entity_id.js";
import { bus } from "../bus/bus.js";
import { CreateEntity } from "./core_entity_events.js";
import { SomePayload } from "../payloads/payload.js";
import { SetPayload } from "./set_payload.js";
import { RenderingPayloadValue } from "../payloads/rendering_payload.js";
import { PhysicsPayloadValue } from "../payloads/physics_payload.js";

type MakeEntityArgs = {
    entityId?: Id,
    initialPos?: Pos,
    label: string,
    rendering?: RenderingPayloadValue,
    physics?: PhysicsPayloadValue,
};

// Utility that dispatches a common bundle of events for making a new entity.
export function makeEntity({
    entityId,
    initialPos,
    label,
    rendering,
    physics
}: MakeEntityArgs, ...otherPayloads: SomePayload[]): Id {
    const create = new CreateEntity(label, initialPos, entityId);
    const id = create.entityId;
    bus.dispatch(create);

    if (rendering)
        bus.dispatch(new SetPayload(id, {
            type: 'RENDERING',
            value: rendering
        }))

    if (physics)
        bus.dispatch(new SetPayload(id, {
            type: 'PHYSICS',
            value: physics
        }))

    for (const p of otherPayloads) {
        bus.dispatch(new SetPayload(id, p));
    }
    return id;
}