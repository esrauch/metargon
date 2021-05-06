import { BusEvent, BusListener } from "../bus/bus.js";
import { CreateEntityEvent } from "../bus/events/create_entity.js";
import { DestroyEntityEvent } from "../bus/events/destroy_entity.js";
import { Id } from "./entity_id.js";

export class IdTable implements BusListener {
    readonly ids = new Set<Id>();
    private constructor() { }
    static singleton = new IdTable();

    allIds(): Set<Id> {
        return this.ids;
    }

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                this.createEntity(ev);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev);
                break;
        }
    }
    private createEntity(ev: CreateEntityEvent) {
        this.ids.add(ev.entityId);
    }
    private destroyEntity(ev: DestroyEntityEvent) {
        this.ids.delete(ev.entityId);
    }
}

const idTable = IdTable.singleton;
export { idTable };