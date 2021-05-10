import { Pos } from "../coords/coords.js";
import { makeEntityId } from "../payloads/entity_id.js";
export class CreateEntity {
    constructor(label, initialPos, 
    // Note: it's an error to create an id that already exists.
    entityId) {
        this.type = 'CREATE_ENTITY';
        this.entityId = entityId === undefined ? makeEntityId() : entityId;
        initialPos = initialPos === undefined ? new Pos(0, 0) : initialPos;
        this.corePayload = {
            type: 'CORE',
            payload: {
                label,
                pos: initialPos,
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
export class SetPosition {
    constructor(entityId, pos) {
        this.entityId = entityId;
        this.pos = pos;
        this.type = 'SET_POSITION';
    }
}
