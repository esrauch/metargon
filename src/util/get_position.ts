// All Entities have a position that is managed by either the SimplePositionTable
// or else managed by the Physics singleton. Either case positions should be

import { Pos } from "../coords/coords.js";
import { Id } from "../systems/entity/entity_id.js";
import { positionTable } from "../systems/entity/position_table.js";
import { physics } from "../systems/physics/physics.js";

// looked up through this class which will check both.
export function getCenterPosition(id: Id): Pos {
    const fromTable = positionTable.get(id);
    if (fromTable) return fromTable;

    const fromPhysics = physics.getPosition(id);
    if (fromPhysics) return fromPhysics;

    debugger;
    throw Error(`Tried to get the position for ${id} but no one knew it`);
}
