import { BusEvent, BusListener } from "../bus/bus.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { Id } from "../payloads/entity_id.js";
import { isPayloadType, PayloadType, SomeTypedPayload, SpecificTypedPayload } from "../payloads/payload.js";

const SPECIALIZED_PAYLOAD_TYPE: Set<PayloadType> = new Set([
    'PHYSICS',
    'RENDERING',
]);

// Lookup arbitrary payloads by EntityId, except for the "specialized" payload types
// which are handled by their respective systems.
export class GenericPayloadTable implements BusListener {
    readonly allIds = new Set<number>();
    private readonly table = new Map<PayloadType, Map<Id, SomeTypedPayload>>();
    private constructor() {}
    static singleton = new GenericPayloadTable();

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'LEVEL_CHANGED':
                this.reset();
                break;
            case 'CREATE_ENTITY':
                this.allIds.add(ev.entityId);
                this.handleSetPayload(ev.entityId, ev.corePayload);
                break;
            case 'SET_PAYLOAD':
                this.handleSetPayload(ev.entityId, ev.typedPayload);
                break;
            case 'CLEAR_PAYLOAD':
                this.table.get(ev.payloadType)?.delete(ev.entityId);
                break;
            case 'DESTROY_ENTITY':
                this.allIds.delete(ev.entityId);
                this.clearAllPayloadsFor(ev.entityId);
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

    private reset() {
        this.allIds.clear();
        this.table.clear();
    }

    private handleSetPayload(id: Id, typedPayload: SomeTypedPayload) {
        if (!this.allIds.has(id)) {
            console.error('set payload on a dangling id', id);
        }
        const payloadType = typedPayload.type;
        if (SPECIALIZED_PAYLOAD_TYPE.has(payloadType)) return;

        let typeSpecificMap = this.table.get(payloadType);
        if (!typeSpecificMap) {
            typeSpecificMap = new Map<Id, SomeTypedPayload>();
            this.table.set(payloadType, typeSpecificMap)
        }
        typeSpecificMap.set(id, typedPayload);
    }

    private clearAllPayloadsFor(entityId: number) {
        for (const typeSpecificMap of this.table.values())
            typeSpecificMap.delete(entityId);
    }
}

const genericPayloadTable = GenericPayloadTable.singleton;
export {genericPayloadTable};