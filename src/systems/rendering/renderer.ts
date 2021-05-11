import { BusEvent, BusListener } from "../../bus/bus.js";
import { Draw } from "../../events/draw.js";
import { COLORS } from "../../gfx/gfx.js";
import { Id } from "../../payloads/entity_id.js";
import { SetPayload } from "../../events/set_payload.js";
import { coreTable } from "../core_table.js";
import { getCenterPosition } from "../getters.js";
import { DrawFn, makeRenderingFn } from "./rendering_fns.js";


export class Renderer implements BusListener {
    readonly debugUi = {
        disableNormalRendering: false,
        renderLabels: false,
        renderIds: false,
    };

    private constructor() { }
    static singleton = new Renderer();
    readonly renderingFns = new Map<Id, DrawFn>();

    reset() { this.renderingFns.clear(); }

    onEvent(ev: BusEvent): void {
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

    maybeSetPayload(ev: SetPayload) {
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
            for (const id of coreTable.allIds()) {
                const pos = getCenterPosition(id);
                let debugString = "";
                if (this.debugUi.renderLabels)
                    debugString += coreTable.getLabel(id) || "<unknown>";
                if (this.debugUi.renderIds)
                    debugString += " " + id;
                gfx.text(pos, debugString, {color: COLORS.DEBUG});
            }
        }
    }
}

const renderer = Renderer.singleton;
export { renderer };
