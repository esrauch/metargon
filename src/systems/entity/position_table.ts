

import { BusEvent, BusListener } from "../../bus/bus.js";
import { Pos } from "../../coords/coords.js";
import { physics } from "../physics/physics.js";
import { Id } from "./entity_id.js";

export class PositionTable implements BusListener {
    private simpleTable = new Map<Id, Pos>();
    private constructor() { }
    static singleton = new PositionTable();

    get(id: Id): Pos|undefined {
        return this.simpleTable.get(id);
    }

    private set(id: Id, pos: Pos) {
        this.simpleTable.set(id, pos);
    }

    private remove(id: Id) {
        this.simpleTable.delete(id);
    }

    onEvent(ev: BusEvent): void {
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

const positionTable = PositionTable.singleton;
export { positionTable };