import { Color } from "../../gfx/gfx.js";
import { getCenterPosition, getLabel } from "../getters.js";
import { makeRenderingFn } from "./rendering_fns.js";
import { genericPayloadTable } from "../generic_payload_table.js";
export class Renderer {
    constructor() {
        this.debugUi = {
            disableNormalRendering: false,
            renderLabels: false,
            renderIds: false,
        };
        this.renderingFns = new Map();
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'LEVEL_CHANGED':
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
    maybeSetPayload(ev) {
        const id = ev.entityId;
        const payload = ev.typedPayload;
        if (payload.type === 'RENDERING') {
            if (payload.payload)
                this.renderingFns.set(id, makeRenderingFn(payload.payload));
            else
                this.renderingFns.delete(id);
        }
    }
    draw(ev) {
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
                gfx.text(pos, debugString, { color: Color.DEBUG });
            }
        }
    }
}
Renderer.singleton = new Renderer();
const renderer = Renderer.singleton;
export { renderer };
