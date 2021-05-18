import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { Pos } from "../coords/coords.js";
import { ClearPayloadEvent } from "../events/payload_events.js";
import { Tick } from "../events/tick_event.js";
import { Id } from "../payloads/entity_id.js";
import { CacheMap } from "../util/cache_map.js";
import { rectContains } from "../util/intersect.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { getCenterPosition } from "./getters.js";

export class SensorSystem implements BusListener {
    private constructor() { }
    static singleton = new SensorSystem();

    // TODO: This is to prevent sensors from triggering while screen crossfade animations
    // are still going. It would be better to do it another way.
    private sensorsTriggering = false;

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'TICK':
                if (this.sensorsTriggering) this.tick(ev);
                break;
            case 'SCREEN_FULLY_SHOWN':
                this.sensorsTriggering = true;
                break;
            case 'LEVEL_CHANGED':
                this.sensorsTriggering = false;
                break;
        }
    }

    private tick(ev: Tick) {
        const sensorPayloads = genericPayloadTable.getPayloads('SENSOR');
        const cachedPos = new CacheMap<Id, Pos>();
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

const sensorSystem = SensorSystem.singleton;
export { sensorSystem };