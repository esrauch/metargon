import { isPayloadType } from "../payloads/payload.js";
const SPECIALIZED_PAYLOAD_TYPE = new Set([
    'CORE',
    'PHYSICS',
    'RENDERING',
]);
// Lookup arbitrary payloads by EntityId, except for the "specialized" payload types
// which are handled by their respective systems.
export class GenericPayloadTable {
    constructor() {
        this.table = new Map();
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'SET_PAYLOAD':
                this.handleSetPayload(ev);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev.entityId);
                break;
        }
    }
    getPayload(type, id) {
        var _a;
        const payload = (_a = this.table.get(type)) === null || _a === void 0 ? void 0 : _a.get(id);
        if (!payload)
            return undefined;
        if (!isPayloadType(payload, type))
            throw Error('Wrong payload type put into table');
        return payload;
    }
    handleSetPayload(ev) {
        const payloadType = ev.payload.type;
        if (SPECIALIZED_PAYLOAD_TYPE.has(payloadType))
            return;
        let typeSpecificMap = this.table.get(payloadType);
        if (!typeSpecificMap) {
            typeSpecificMap = new Map();
            this.table.set(payloadType, typeSpecificMap);
        }
        typeSpecificMap.set(ev.entityId, ev.payload);
    }
    destroyEntity(entityId) {
        for (const typeSpecificMap of this.table.values())
            typeSpecificMap.delete(entityId);
    }
}
GenericPayloadTable.singleton = new GenericPayloadTable();
const genericPayloadTable = GenericPayloadTable.singleton;
export { genericPayloadTable };
