export class LabelTable {
    constructor() {
        this.simpleTable = new Map();
    }
    getLabel(id) {
        return this.simpleTable.get(id) || '<unknown>';
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                this.simpleTable.set(ev.entityId, ev.label);
                break;
            case 'DESTROY_ENTITY':
                this.simpleTable.delete(ev.entityId);
                break;
        }
    }
}
LabelTable.singleton = new LabelTable();
const labelTable = LabelTable.singleton;
export { labelTable };
