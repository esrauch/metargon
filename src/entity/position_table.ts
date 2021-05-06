

import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { CreateEntityEvent } from "../bus/events/create_entity.js";
import { DestroyEntityEvent } from "../bus/events/destroy_entity.js";
import { Pos } from "../coords/coords.js";
import { physics } from "../physics/physics.js";
import { Id } from "./entity_id.js";


// All Entities have a position that is managed by either the SimplePositionTable
// or else managed by the Physics singleton. Either case positions should be
// looked up through this class which will check both.

export class PositionTable implements BusListener {
    readonly simpleTable = new Map<Id, Pos>();
    private constructor() { }
    static singleton = new PositionTable();

    getCenterPosition(id: Id): Pos {
        const fromTable = this.simpleTable.get(id);
        if (fromTable) return fromTable;

        const fromPhysics = physics.getPosition(id);
        if (fromPhysics) return fromPhysics;

        throw Error('Tried to get the position but no one knew it');
    }

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                this.createEntity(ev);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev);
                break;
        }
    }
    private createEntity(ev: CreateEntityEvent) {
        // If there's physics data set then the Physics system will manage the position.
        if (ev.physics) {
            return;
        }
        this.simpleTable.set(ev.entityId, ev.initial_pos);
    }
    private destroyEntity(ev: DestroyEntityEvent) {
        this.simpleTable.delete(ev.entityId);
    }
}

const positionTable = PositionTable.singleton;
export { positionTable };