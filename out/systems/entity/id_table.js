export class IdTable {
    constructor() {
        this.ids = new Set();
    }
    allIds() {
        return this.ids;
    }
    onEvent(ev) {
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
IdTable.singleton = new IdTable();
const idTable = IdTable.singleton;
export { idTable };
