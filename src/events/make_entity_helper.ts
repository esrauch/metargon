import { Pos } from "../coords/coords.js";
import { Id } from "../payloads/entity_id.js";
import { bus } from "../bus/bus.js";
import { CreateEntity } from "./core_entity_events.js";
import { SomeTypedPayload } from "../payloads/payload.js";
import { SetPayload } from "./set_payload.js";
import { RenderingPayload } from "../payloads/rendering_payload.js";
import { PhysicsPayload } from "../payloads/physics_payload.js";

type MakeEntityArgs = {
    entityId?: Id,
    initialPos?: Pos,
    label: string,
    rendering?: RenderingPayload,
    physics?: PhysicsPayload,
};

// Utility that dispatches a common bundle of events for making a new entity.
export function makeEntity({
    entityId,
    initialPos,
    label,
    rendering,
    physics
}: MakeEntityArgs, ...otherPayloads: SomeTypedPayload[]): Id {
    const create = new CreateEntity(label, initialPos, entityId);
    const id = create.entityId;
    bus.dispatch(create);

    if (rendering)
        bus.dispatch(new SetPayload(id, {
            type: 'RENDERING',
            payload: rendering
        }))

    if (physics)
        bus.dispatch(new SetPayload(id, {
            type: 'PHYSICS',
            payload: physics
        }))

    for (const p of otherPayloads) {
        bus.dispatch(new SetPayload(id, p));
    }
    return id;
}