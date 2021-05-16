import { bus } from "../bus/bus.js";
import { ClearPayloadEvent } from "../events/payload_events.js";
import { CacheMap } from "../util/cache_map.js";
import { rectContains } from "../util/intersect.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { getCenterPosition } from "./getters.js";
export class SensorSystem {
    constructor() { }
    onEvent(ev) {
        if (ev.type == 'TICK') {
            const sensorPayloads = genericPayloadTable.getPayloads('SENSOR');
            const cachedPos = new CacheMap();
            for (const [id, sensorTypedPayload] of sensorPayloads) {
                const sensorPos = getCenterPosition(id);
                const sensorRect = sensorTypedPayload.payload.rect;
                const targetId = sensorTypedPayload.payload.target;
                const targetPos = cachedPos.get(targetId, () => getCenterPosition(targetId));
                const triggerOnOutside = !!sensorTypedPayload.payload.triggerOnOutside;
                if (rectContains(sensorPos, sensorRect.w, sensorRect.h, targetPos) !== triggerOnOutside) {
                    bus.dispatch(new ClearPayloadEvent(id, 'SENSOR'));
                    sensorTypedPayload.payload.callback(targetId);
                }
            }
        }
    }
}
SensorSystem.singleton = new SensorSystem();
const sensorSystem = SensorSystem.singleton;
export { sensorSystem };
