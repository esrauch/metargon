import { makeEntityId } from "../payloads/entity_id.js";
export class CreateEntity {
    constructor(label, 
    // Note: it's an error to create an id that already exists.
    entityId) {
        this.type = 'CREATE_ENTITY';
        this.entityId = entityId === undefined ? makeEntityId() : entityId;
        this.corePayload = {
            type: 'CORE',
            payload: {
                label,
            }
        };
    }
}
export class DestroyEntity {
    constructor(entityId) {
        this.entityId = entityId;
        this.type = 'DESTROY_ENTITY';
    }
}
