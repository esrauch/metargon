import { BusEvent, BusListener } from "../bus/bus.js";
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
                if (this.ids.has(ev.entityId))
                    throw Error(`Double create of ${ev.entityId}`);
                this.ids.add(ev.entityId);
                break;
            case 'DESTROY_ENTITY':
                this.ids.delete(ev.entityId);
                break;
        }
    }
}

const idTable = IdTable.singleton;
export { idTable };