
import { Pos } from "../coords/coords.js";
import { Id } from "../payloads/entity_id.js";
import { HittestTypedPayload } from "../payloads/hittest_payload.js";
import { rectContains } from "../util/intersect.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { physics } from "./physics/physics.js";

// All Entities have a position that is managed by either the SimplePositionTable
// or else managed by the Physics singleton. Either case positions should be
// looked up through this class which will check both.
export function getCenterPosition(id: Id): Pos {
    const fromPhysics = physics.getPosition(id);
    if (fromPhysics) return fromPhysics;

    const indirect = genericPayloadTable.getPayload('POSITION_ATTACHMENT', id);
    if (indirect) return getCenterPosition(indirect.payload.otherEntity);

    const fixedPosition = genericPayloadTable.getPayload('POSITION', id);
    if (fixedPosition) return fixedPosition.payload;

    console.error(`tried to get the position for ${id} but no one knew it`);
    return new Pos(0, 0);
}

export function getRotation(id: Id): number|undefined {
    // Only if its managed by physics, otherwise nothing.
    return physics.getBody(id)?.angle;
}

export function getLabel(id: Id): string {
    const labelPayload = genericPayloadTable.getPayload('CORE', id);
    return labelPayload?.payload.label ?? '?';
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

export function isLocked(id: Id): boolean {
    const p = genericPayloadTable.getPayload('LOCKED', id);
    if (!p) return false;
    return p.payload.isLocked;
}