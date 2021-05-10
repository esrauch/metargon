import { BusEvent, BusListener } from "../bus/bus.js";
import { SetPayload } from "../events/set_payload.js";
import { Id } from "../payloads/entity_id.js";
import { isPayloadType, PayloadType, SomeTypedPayload, SpecificTypedPayload } from "../payloads/payload.js";

const SPECIALIZED_PAYLOAD_TYPE: Set<PayloadType> = new Set([
    'CORE',
    'PHYSICS',
    'RENDERING',
]);

// Lookup arbitrary payloads by EntityId, except for the "specialized" payload types
// which are handled by their respective systems.
export class GenericPayloadTable implements BusListener {
    readonly table = new Map<PayloadType, Map<Id, SomeTypedPayload>>();
    private constructor() {}
    static singleton = new GenericPayloadTable();
    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'SET_PAYLOAD':
                this.handleSetPayload(ev);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev.entityId);
                break;
        }
    }

    getPayloads<T extends PayloadType>(type: T): Map<Id, SpecificTypedPayload<T>> {
        const p = this.table.get(type);
        if (!p) return new Map();
        return p as Map<Id, SpecificTypedPayload<T>>;
    }

    getPayload<T extends PayloadType>(type: T, id: Id) : (SomeTypedPayload & {type: T}) | undefined {
        const payload = this.table.get(type)?.get(id);
        if (!payload) return undefined;
        if (!isPayloadType(payload, type)) throw Error('Wrong payload type put into table');
        return payload as any;
    }

    private handleSetPayload(ev: SetPayload) {
        const payloadType = ev.typedPayload.type;
        if (SPECIALIZED_PAYLOAD_TYPE.has(payloadType)) return;

        let typeSpecificMap = this.table.get(payloadType);
        if (!typeSpecificMap) {
            typeSpecificMap = new Map<Id, SomeTypedPayload>();
            this.table.set(payloadType, typeSpecificMap)
        }
        typeSpecificMap.set(ev.entityId, ev.typedPayload);
    }

    destroyEntity(entityId: number) {
        for (const typeSpecificMap of this.table.values())
            typeSpecificMap.delete(entityId);
    }
}

const genericPayloadTable = GenericPayloadTable.singleton;
export {genericPayloadTable};