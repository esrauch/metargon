import { BusEvent, BusListener } from "../bus/bus.js";
import { Pos } from "../coords/coords.js";
import { CorePayloadValue } from "../payloads/core_payload.js";
import { Id } from "../payloads/entity_id.js";

export class CoreTable implements BusListener {
    readonly table = new Map<Id, CorePayloadValue>();
    private constructor() { }
    static singleton = new CoreTable();

    allIds(): Iterable<Id> {
        return this.table.keys();
    }

    getLabel(id: Id): string|undefined {
        return this.table.get(id)?.label;
    }

    // Note: This value will be stale if this is a physics-enabled object.
    // Use the util/get_position.ts to get the position instead.
    getPosition(id: Id): Pos|undefined {
        return this.table.get(id)?.pos;
    }

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                if (this.table.has(ev.entityId))
                    throw Error(`Double create of ${ev.entityId}`);
                this.table.set(ev.entityId, ev.corePayload.value);
                break;
            case 'DESTROY_ENTITY':
                this.table.delete(ev.entityId);
                break;
            case 'SET_POSITION':
                const v = this.table.get(ev.entityId);
                if (v) {
                    this.table.set(ev.entityId, {
                        ...v,
                        pos: ev.pos
                    });
                }
                break;
            case 'SET_PAYLOAD':
                if (ev.payload.type == 'CORE')
                    throw Error('Not allowed to SET_PAYLOAD Core');
                break;
        }
    }
}

const coreTable = CoreTable.singleton;
export { coreTable };