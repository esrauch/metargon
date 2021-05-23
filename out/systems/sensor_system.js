import { bus } from "../bus/bus.js";
import { ClearPayloadEvent } from "../events/payload_events.js";
import { CacheMap } from "../util/cache_map.js";
import { rectContains } from "../util/intersect.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { getCenterPosition } from "./getters.js";
export class SensorSystem {
    constructor() {
        // TODO: This is to prevent sensors from triggering while screen crossfade animations
        // are still going. It would be better to do it another way.
        this.sensorsTriggering = false;
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'TICK':
                this.tick(ev);
                break;
            case 'SCREEN_FULLY_SHOWN':
                this.sensorsTriggering = true;
                break;
            case 'LEVEL_CHANGED':
                this.sensorsTriggering = false;
                break;
        }
    }
    tick(ev) {
        const sensorTypedPayloads = genericPayloadTable.getPayloads('SENSOR');
        const cachedPos = new CacheMap();
        for (const [sensorId, sensorTypedPayload] of sensorTypedPayloads) {
            const sensorPos = getCenterPosition(sensorId);
            const sensorPayload = sensorTypedPayload.payload;
            if (!this.sensorsTriggering && !sensorPayload.instantActivate)
                continue;
            const sensorRect = sensorPayload.rect;
            const targetId = sensorPayload.target;
            const targets = targetId !== undefined ?
                [targetId] : genericPayloadTable.allIds;
            const triggerOnOutside = !!sensorPayload.triggerOnOutside;
            for (const t of targets) {
                if (t === sensorId)
                    continue;
                const targetPos = cachedPos.get(t, () => getCenterPosition(t));
                if (rectContains(sensorPos, sensorRect.w, sensorRect.h, targetPos) !== triggerOnOutside) {
                    sensorPayload.callback(t);
                    if (!sensorPayload.triggerMultipleTimes) {
                        bus.dispatch(new ClearPayloadEvent(sensorId, 'SENSOR'));
                        break;
                    }
                }
            }
        }
    }
}
SensorSystem.singleton = new SensorSystem();
const sensorSystem = SensorSystem.singleton;
export { sensorSystem };
