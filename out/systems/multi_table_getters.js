import { coreTable } from "./core_table.js";
import { physics } from "./physics/physics.js";
// All Entities have a position that is managed by either the SimplePositionTable
// or else managed by the Physics singleton. Either case positions should be
// looked up through this class which will check both.
export function getCenterPosition(id) {
    const fromPhysics = physics.getPosition(id);
    if (fromPhysics)
        return fromPhysics;
    const fromTable = coreTable.getPosition(id);
    if (fromTable)
        return fromTable;
    throw Error(`Tried to get the position for ${id} but no one knew it`);
}
