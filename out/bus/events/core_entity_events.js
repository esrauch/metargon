import { Pos } from "../../coords/coords.js";
import { makeEntityId } from "../../systems/core_entity/entity_id.js";
export class CreateEntity {
    constructor(label, initialPos, 
    // Note: it's an error to create an id that already exists.
    entityId) {
        this.label = label;
        this.type = 'CREATE_ENTITY';
        this.entityId = entityId === undefined ? makeEntityId() : entityId;
        this.initialPos = initialPos === undefined ? new Pos(0, 0) : initialPos;
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
