export class PositionTable {
    constructor() {
        this.simpleTable = new Map();
    }
    get(id) {
        return this.simpleTable.get(id);
    }
    set(id, pos) {
        this.simpleTable.set(id, pos);
    }
    remove(id) {
        this.simpleTable.delete(id);
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                this.set(ev.entityId, ev.initialPos);
                break;
            case 'SET_POSITION':
                if (this.simpleTable.has(ev.entityId)) {
                    this.set(ev.entityId, ev.pos);
                }
                break;
            case 'ENABLE_PHYSICS':
                // Enabling physics causes the position to become handled by
                // the physics engine instead of by the simple table.
                this.remove(ev.entityId);
                break;
            case 'DESTROY_ENTITY':
                this.remove(ev.entityId);
                break;
        }
    }
}
PositionTable.singleton = new PositionTable();
const positionTable = PositionTable.singleton;
export { positionTable };
