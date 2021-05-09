import { BusEvent, BusListener } from "../bus/bus.js";
import { Draw } from "../events/draw.js";
import { add, Pos, Positions } from "../coords/coords.js";
import { COLORS, Gfx } from "../gfx/gfx.js";
import { Primitive, RenderingPayloadValue } from "../payloads/rendering_payload.js";
import { Id } from "../payloads/entity_id.js";
import { SetPayload } from "../events/set_payload.js";
import { coreTable } from "./core_table.js";
import { getCenterPosition } from "./multi_table_getters.js";

type DrawFn = (gfx: Gfx, id: Id, pos: Pos) => void;

function makeRenderingFn(value: RenderingPayloadValue): DrawFn {
    switch(value.type) {
        case 'FUNCTION':
            return value.fn;
        case 'CUSTOM':
            return (gfx, id, pos) => value.obj.draw(gfx, id, pos);
        case 'COMPOUND':
            return makeCompoundRenderingFn(value.prims);
        default:
            return makeCompoundRenderingFn([value]);
    }
}

function makeCompoundRenderingFn(prims: Primitive[]): DrawFn {
    return (gfx: Gfx, id: Id, pos: Pos) => {
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
        const payload = ev.payload;
        if (payload.type !== 'RENDERING') return;
        if (payload.value)
            this.renderingFns.set(ev.entityId, makeRenderingFn(payload.value));
        else
            this.renderingFns.delete(ev.entityId);
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
