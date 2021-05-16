import { isPayloadType } from "../payloads/payload.js";
const SPECIALIZED_PAYLOAD_TYPE = new Set([
    'PHYSICS',
    'RENDERING',
]);
// Lookup arbitrary payloads by EntityId, except for the "specialized" payload types
// which are handled by their respective systems.
export class GenericPayloadTable {
    constructor() {
        this.allIds = new Set();
        this.table = new Map();
    }
    onEvent(ev) {
        var _a;
        switch (ev.type) {
            case 'RESET_ALL_SYSTEMS':
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
                (_a = this.table.get(ev.payloadType)) === null || _a === void 0 ? void 0 : _a.delete(ev.entityId);
                break;
            case 'DESTROY_ENTITY':
                this.allIds.delete(ev.entityId);
                this.clearAllPayloadsFor(ev.entityId);
                break;
        }
    }
    getPayloads(type) {
        const p = this.table.get(type);
        if (!p)
            return new Map();
        return p;
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
    reset() {
        this.allIds.clear();
        this.table.clear();
    }
    handleSetPayload(id, typedPayload) {
        if (!this.allIds.has(id)) {
            console.error('set payload on a dangling id', id);
        }
        const payloadType = typedPayload.type;
        if (SPECIALIZED_PAYLOAD_TYPE.has(payloadType))
            return;
        let typeSpecificMap = this.table.get(payloadType);
        if (!typeSpecificMap) {
            typeSpecificMap = new Map();
            this.table.set(payloadType, typeSpecificMap);
        }
        typeSpecificMap.set(id, typedPayload);
    }
    clearAllPayloadsFor(entityId) {
        for (const typeSpecificMap of this.table.values())
            typeSpecificMap.delete(entityId);
    }
}
GenericPayloadTable.singleton = new GenericPayloadTable();
const genericPayloadTable = GenericPayloadTable.singleton;
export { genericPayloadTable };
