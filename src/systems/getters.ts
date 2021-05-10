
import { Pos } from "../coords/coords.js";
import { Id } from "../payloads/entity_id.js";
import { HittestTypedPayload } from "../payloads/hittest_payload.js";
import { rectContains } from "../util/intersect.js";
import { coreTable } from "./core_table.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { physics } from "./physics/physics.js";

// All Entities have a position that is managed by either the SimplePositionTable
// or else managed by the Physics singleton. Either case positions should be
// looked up through this class which will check both.
export function getCenterPosition(id: Id): Pos {
    const fromPhysics = physics.getPosition(id);
    if (fromPhysics) return fromPhysics;

    const fromTable = coreTable.getPosition(id);
    if (fromTable) return fromTable;

    throw Error(`Tried to get the position for ${id} but no one knew it`);
}

export function hittest(test: Pos): HittestTypedPayload | undefined {
    const payloads = genericPayloadTable.getPayloads("HITTEST");
    for (const [id, hittestPayload] of payloads) {
        const pos = getCenterPosition(id);
        if (rectContains(pos,
            hittestPayload.payload.w,
            hittestPayload.payload.h,
            test)) {
            return hittestPayload;
        }
    }
    return undefined;
}