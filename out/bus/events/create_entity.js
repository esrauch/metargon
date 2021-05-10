import { makeEntityId } from "../../entity/entity_id.js";
export class CreateEntityEvent {
    constructor(label, initialPos) {
        this.label = label;
        this.initialPos = initialPos;
        this.type = 'CREATE_ENTITY';
        this.entityId = makeEntityId();
    }
}
