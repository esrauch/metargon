// All Entities have a position that is managed by either the SimplePositionTable
// or else managed by the Physics singleton.
import { physics } from "../physics/physics.js";
const simpleTable = new Map();
export function getCenterPosition(id) {
    const fromTable = simpleTable.get(id);
    if (fromTable)
        return fromTable;
    const fromPhysics = physics.getPosition(id);
    if (fromPhysics)
        return fromPhysics;
    throw Error('Tried to get the position but no one knew it');
}
