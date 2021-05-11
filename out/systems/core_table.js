export class CoreTable {
    constructor() {
        this.table = new Map();
    }
    reset() { this.table.clear(); }
    allIds() {
        return this.table.keys();
    }
    getLabel(id) {
        var _a;
        return (_a = this.table.get(id)) === null || _a === void 0 ? void 0 : _a.label;
    }
    // Note: This value will be stale if this is a physics-enabled object.
    // Use the util/get_position.ts to get the position instead.
    getPosition(id) {
        var _a;
        return (_a = this.table.get(id)) === null || _a === void 0 ? void 0 : _a.pos;
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                if (this.table.has(ev.entityId))
                    throw Error(`Double create of ${ev.entityId}`);
                this.table.set(ev.entityId, ev.corePayload.payload);
                break;
            case 'DESTROY_ENTITY':
                this.table.delete(ev.entityId);
                break;
            case 'SET_POSITION':
                const v = this.table.get(ev.entityId);
                if (v) {
                    this.table.set(ev.entityId, Object.assign(Object.assign({}, v), { pos: ev.pos }));
                }
                break;
            case 'SET_PAYLOAD':
                if (ev.typedPayload.type == 'CORE')
                    throw Error('Not allowed to SET_PAYLOAD Core');
                break;
        }
    }
}
CoreTable.singleton = new CoreTable();
const coreTable = CoreTable.singleton;
export { coreTable };
