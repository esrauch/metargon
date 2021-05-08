import { BusEvent, BusListener } from "../../bus/bus.js";
import { Draw } from "../../events/draw.js";
import { add, Pos, Positions } from "../../coords/coords.js";
import { DEBUG_COLOR, Gfx } from "../../gfx/gfx.js";
import { getCenterPosition } from "../../util/get_position.js";
import { EntityRenderingState, Primitive } from "./entity_rendering_state.js";
import { Id } from "../entity/entity_id.js";
import { idTable } from "../entity/id_table.js";
import { labelTable } from "../entity/label_table.js";

type DrawFn = (gfx: Gfx, pos: Pos) => void;

function makeRenderingFn(ero: EntityRenderingState): DrawFn {
    switch(ero.type) {
        case 'FUNCTION':
            return ero.fn;
        case 'CUSTOM':
            return (gfx, pos) => ero.obj.draw(gfx, pos);
        case 'COMPOUND':
            return makeCompoundRenderingFn(ero.prims);
        default:
            return makeCompoundRenderingFn([ero]);
    }
}

function makeCompoundRenderingFn(prims: Primitive[]): DrawFn {
    return (gfx: Gfx, pos: Pos) => {
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
                    const halfw = p.width / 2;
                    const halfh = p.height / 2;
                    const top = pos.y - halfh;
                    const right = pos.x + halfw;
                    const bottom = pos.y + halfh;
                    const left = pos.x - halfw;
                    gfx.filledpoly(new Positions([
                        [left, top],
                        [right, top],
                        [right, bottom],
                        [left, bottom],
                    ]));
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
            case 'SET_RENDERING':
                if (ev.renderingData)
                    this.renderingFns.set(ev.entityId, makeRenderingFn(ev.renderingData));
                else
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

    draw(ev: Draw) {
        const gfx = ev.gfx;

        if (!this.debugUi.disableNormalRendering) {
            for (const [id, fn] of this.renderingFns) {
                const pos = getCenterPosition(id);
                fn(gfx, pos);
            }
        }

        if (this.debugUi.renderLabels || this.debugUi.renderIds) {
            for (const id of idTable.allIds()) {
                const pos = getCenterPosition(id);
                let debugString = "";
                if (this.debugUi.renderLabels)
                    debugString += labelTable.getLabel(id) || "<unknown>";
                if (this.debugUi.renderIds)
                    debugString += " " + id;
                gfx.text(pos, debugString, {color: DEBUG_COLOR});
            }
        }
    }
}

const renderer = Renderer.singleton;
export { renderer };
