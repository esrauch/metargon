import { BusEvent, BusListener } from "../../bus/bus.js";
import { Draw } from "../../events/draw.js";
import { Color } from "../../gfx/gfx.js";
import { Id } from "../../payloads/entity_id.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { getCenterPosition, getLabel } from "../getters.js";
import { DrawFn, makeRenderingFn } from "./rendering_fns.js";
import { genericPayloadTable } from "../generic_payload_table.js";


export class Renderer implements BusListener {
    readonly debugUi = {
        disableNormalRendering: false,
        renderLabels: false,
        renderIds: false,
    };

    private constructor() { }
    static singleton = new Renderer();
    readonly renderingFns = new Map<Id, DrawFn>();

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'RESET_ALL_SYSTEMS':
                this.renderingFns.clear();
                break;
            case 'SET_PAYLOAD':
                this.maybeSetPayload(ev);
                break;
            case 'CLEAR_PAYLOAD':
                if (ev.payloadType == 'RENDERING')
                    this.renderingFns.delete(ev.entityId);
                break;
            case 'DESTROY_ENTITY':
                this.renderingFns.delete(ev.entityId);
                break;
            case 'DRAW':
                this.draw(ev);
                break;
        }
    }

    maybeSetPayload(ev: SetPayloadEvent) {
        const id = ev.entityId;
        const payload = ev.typedPayload;
        if (payload.type === 'RENDERING') {
            if (payload.payload)
                this.renderingFns.set(id, makeRenderingFn(payload.payload));
            else
                this.renderingFns.delete(id);
        }
    }

    draw(ev: Draw) {
        const gfx = ev.gfx;

        if (!this.debugUi.disableNormalRendering) {
            for (const [id, fn] of this.renderingFns) {
                const pos = getCenterPosition(id);
                fn(gfx, id, pos);
            }
        }

        if (this.debugUi.renderLabels || this.debugUi.renderIds) {
            for (const id of genericPayloadTable.allIds) {
                const pos = getCenterPosition(id);
                let debugString = "";
                if (this.debugUi.renderLabels)
                    debugString += getLabel(id) || "<unknown>";
                if (this.debugUi.renderIds)
                    debugString += " " + id;
                gfx.text(pos, debugString, {color: Color.DEBUG});
            }
        }
    }
}

const renderer = Renderer.singleton;
export { renderer };
