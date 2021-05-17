import { CoreTypedPayload } from "../payloads/core_payload.js";
import { Id, makeEntityId } from "../payloads/entity_id.js";


export class CreateEntity {
    readonly type = 'CREATE_ENTITY';
    readonly entityId: number;
    readonly corePayload: CoreTypedPayload;

    constructor(
        label: string,
        // Note: it's an error to create an id that already exists.
        entityId?: Id
    ) {
        this.entityId = entityId === undefined ? makeEntityId() : entityId;
        this.corePayload = {
            type: 'CORE',
            payload: {
                label,
            }
        }
    }
}

export class DestroyEntity {
    readonly type = 'DESTROY_ENTITY';

    constructor(
        readonly entityId: Id
    ) { }
}
