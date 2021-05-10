import { makeEntityId } from "../../entity/entity_id.js";
export class CreateObjectEvent {
    constructor(initial_pos, label, rendering_data, physics) {
        this.initial_pos = initial_pos;
        this.label = label;
        this.rendering_data = rendering_data;
        this.physics = physics;
        this.type = 'CREATE_OBJECT';
        this.entityId = makeEntityId();
    }
    static create(data) {
        return new CreateObjectEvent(data.initial_pos, data.label, data.rendering_data, data.physics);
    }
}
