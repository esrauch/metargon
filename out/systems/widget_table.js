import { getCenterPosition } from "./multi_table_getters.js";
function rectContains(pos, w, h, target) {
    const T = pos.y - h / 2;
    const R = pos.x + w / 2;
    const B = pos.y + h / 2;
    const L = pos.x - w / 2;
    return target.x <= R && target.x >= L && target.y <= B && target.y >= T;
}
export class WidgetTable {
    constructor() {
        this.table = new Map();
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'DESTROY_ENTITY':
                this.table.delete(ev.entityId);
                break;
            case 'SET_PAYLOAD':
                if (ev.typedPayload.type == 'WIDGET')
                    this.table.set(ev.entityId, ev.typedPayload.payload);
                break;
        }
    }
    hitTest(target) {
        for (const [id, value] of this.table) {
            const pos = getCenterPosition(id);
            if (rectContains(pos, value.w, value.h, target))
                return value;
        }
        return undefined;
    }
}
WidgetTable.singleton = new WidgetTable();
const widgetTable = WidgetTable.singleton;
export { widgetTable };
