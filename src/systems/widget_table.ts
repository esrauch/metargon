import { BusEvent, BusListener } from "../bus/bus.js";
import { Pos } from "../coords/coords.js";
import { Id } from "../payloads/entity_id.js";
import { WidgetPayload } from "../payloads/widget_payload.js";
import { getCenterPosition } from "./multi_table_getters.js";

function rectContains(pos: Pos, w: number, h: number, target: Pos) {
    const T = pos.y - h / 2;
    const R = pos.x + w / 2;
    const B = pos.y + w / 2;
    const L = pos.x - w / 2;
    return target.x <= R && target.x >= L && target.y <= B && target.y >= T;
}

export class WidgetTable implements BusListener {
    readonly table = new Map<Id, WidgetPayload>();
    private constructor() { }
    static singleton = new WidgetTable();

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'DESTROY_ENTITY':
                this.table.delete(ev.entityId);
                break;
            case 'SET_PAYLOAD':
                if (ev.payload.type == 'WIDGET')
                    this.table.set(ev.entityId, ev.payload.payload);
                break;
        }
    }

    hitTest(target: Pos): WidgetPayload|undefined {
        for (const [id, value] of this.table) {
            const pos = getCenterPosition(id);
            if (rectContains(pos, value.w, value.h, target))
                return value;
        }
        return undefined;
    }
}

const widgetTable = WidgetTable.singleton;
export { widgetTable };