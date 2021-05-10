import { COLORS } from "../../gfx/gfx.js";
import { coreTable } from "../core_table.js";
import { getCenterPosition } from "../getters.js";
import { makeRenderingFn } from "./rendering_fns.js";
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
            case 'SET_PAYLOAD':
                this.maybeSetPayload(ev);
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
            for (const id of coreTable.allIds()) {
                const pos = getCenterPosition(id);
                let debugString = "";
                if (this.debugUi.renderLabels)
                    debugString += coreTable.getLabel(id) || "<unknown>";
                if (this.debugUi.renderIds)
                    debugString += " " + id;
                gfx.text(pos, debugString, { color: COLORS.DEBUG });
            }
        }
    }
}
Renderer.singleton = new Renderer();
const renderer = Renderer.singleton;
export { renderer };
