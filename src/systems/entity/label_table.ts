
import { bus, BusEvent, BusListener } from "../../bus/bus.js";
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
                this.simpleTable.set(ev.entityId, ev.label);
                break;
            case 'DESTROY_ENTITY':
                this.simpleTable.delete(ev.entityId);
                break;
        }
    }
}

const labelTable = LabelTable.singleton;
export {labelTable};