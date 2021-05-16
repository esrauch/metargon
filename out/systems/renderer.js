import { add } from "../coords/coords.js";
import { COLORS } from "../gfx/gfx.js";
import { coreTable } from "./core_table.js";
import { getCenterPosition } from "./multi_table_getters.js";
import { getWidgetRenderer } from "../widgets/widget_renderer_registry.js";
function makeRenderingFn(value) {
    switch (value.type) {
        case 'FUNCTION':
            return value.fn;
        case 'CUSTOM':
            return (gfx, id, pos) => value.obj.draw(gfx, id, pos);
        case 'COMPOUND':
            return makeCompoundRenderingFn(value.prims);
        default:
            return makeCompoundRenderingFn([value]);
    }
    return assertUnreachable(value.type);
}
function makeWidgetRenderingFn(id, payload) {
    const widgetRenderer = getWidgetRenderer(payload.widgetData.type);
    return (gfx, _id, pos) => {
        widgetRenderer.draw(gfx, pos, payload);
    };
}
function makeCompoundRenderingFn(prims) {
    return (gfx, id, pos) => {
        for (const p of prims) {
            switch (p.type) {
                case 'CIRCLE':
                    gfx.circle(pos, p.radius);
                    break;
                case 'LINE':
                    const to = add(pos, p.vec);
                    gfx.line(pos, to);
                    break;
                case 'LINELOOP':
                    // TODO: offset pts by pos
                    gfx.lineloop(p.pts);
                    break;
                case 'RECT':
                    gfx.strokerect(pos, p.width, p.height);
                    break;
                case 'TEXT':
                    gfx.text(pos, p.text, {
                        color: p.color,
                        size: p.size,
                        font: p.font,
                    });
                    break;
                default:
                    throw Error(`unhandled prim ${p}`);
            }
        }
    };
}
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
        else if (payload.type === 'WIDGET') {
            this.renderingFns.set(id, makeWidgetRenderingFn(id, payload.payload));
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
