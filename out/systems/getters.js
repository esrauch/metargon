import { Pos } from "../coords/coords.js";
import { rectContains } from "../util/intersect.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { physics } from "./physics/physics.js";
// All Entities have a position that is managed by either the SimplePositionTable
// or else managed by the Physics singleton. Either case positions should be
// looked up through this class which will check both.
export function getCenterPosition(id) {
    const fromPhysics = physics.getPosition(id);
    if (fromPhysics)
        return fromPhysics;
    const indirect = genericPayloadTable.getPayload('POSITION_ATTACHMENT', id);
    if (indirect)
        return getCenterPosition(indirect.payload.otherEntity);
    const fixedPosition = genericPayloadTable.getPayload('POSITION', id);
    if (fixedPosition)
        return fixedPosition.payload;
    console.error(`tried to get the position for ${id} but no one knew it`);
    return new Pos(0, 0);
}
export function getRotation(id) {
    var _a;
    // Only if its managed by physics, otherwise nothing.
    return (_a = physics.getBody(id)) === null || _a === void 0 ? void 0 : _a.angle;
}
export function getLabel(id) {
    const labelPayload = genericPayloadTable.getPayload('CORE', id);
    return (labelPayload === null || labelPayload === void 0 ? void 0 : labelPayload.payload.label) || '<unknown>';
}
export function hittest(test) {
    const payloads = genericPayloadTable.getPayloads("HITTEST");
    for (const [id, hittestPayload] of payloads) {
        const pos = getCenterPosition(id);
        if (rectContains(pos, hittestPayload.payload.w, hittestPayload.payload.h, test)) {
            return hittestPayload;
        }
    }
    return undefined;
}
