
import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { CreateEntityEvent } from "../bus/events/create_entity.js";
import { DestroyEntityEvent } from "../bus/events/destroy_entity.js";
import { Id } from "./entity_id.js";

export class LabelTable implements BusListener {
    readonly simpleTable = new Map<Id, string>();
    private constructor() {}
    static singleton = new LabelTable();

    getLabel(id: Id): string {
        return this.simpleTable.get(id) || '<unknown>';
    }

    onEvent(ev: BusEvent): void {
        switch(ev.type) {
            case 'CREATE_ENTITY':
                this.createEntity(ev);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev);
                break;
        }
    }

    private createEntity(ev: CreateEntityEvent) {
        this.simpleTable.set(ev.entityId, ev.label);
    }

    private destroyEntity(ev: DestroyEntityEvent) {
        this.simpleTable.delete(ev.entityId);
    }
}

const labelTable = LabelTable.singleton;
export {labelTable};