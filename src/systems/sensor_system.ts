import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { Pos } from "../coords/coords.js";
import { ClearPayloadEvent } from "../events/payload_events.js";
import { Id } from "../payloads/entity_id.js";
import { CacheMap } from "../util/cache_map.js";
import { rectContains } from "../util/intersect.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { getCenterPosition } from "./getters.js";

export class SensorSystem implements BusListener {
    private constructor() { }
    static singleton = new SensorSystem();

    onEvent(ev: BusEvent): void {
        if (ev.type == 'TICK') {
            const sensorPayloads = genericPayloadTable.getPayloads('SENSOR');
            const cachedPos = new CacheMap<Id, Pos>();
            for (const [id, sensorTypedPayload] of sensorPayloads) {
                const sensorPos = getCenterPosition(id);
                const sensorRect = sensorTypedPayload.payload.rect;
                const targetId = sensorTypedPayload.payload.target;
                const targetPos = cachedPos.get(targetId, () => getCenterPosition(targetId));
                if (rectContains(
                    sensorPos,
                    sensorRect.w,
                    sensorRect.h,
                    targetPos)) {
                    bus.dispatch(new ClearPayloadEvent(id, 'SENSOR'));
                    sensorTypedPayload.payload.callback(targetId);
                }
            }
        }
    }
}

const sensorSystem = SensorSystem.singleton;
export { sensorSystem };