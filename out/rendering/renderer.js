import { add, Positions } from "../coords/coords.js";
import { idTable } from "../entity/id_table.js";
import { labelTable } from "../entity/label_table.js";
import { DEBUG_COLOR } from "../gfx/gfx.js";
import { getCenterPosition } from "../util/get_position.js";
function makeRenderingFn(ero) {
    switch (ero.type) {
        case 'CUSTOM':
            return ero.fn;
        case 'COMPOUND':
            return makeCompoundRenderingFn(ero.prims);
        default:
            return makeCompoundRenderingFn([ero]);
    }
}
function makeCompoundRenderingFn(prims) {
    return (gfx, pos) => {
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
                    return assertUnreachable(p.type);
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
    draw(ev) {
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
                gfx.text(pos, debugString, { color: DEBUG_COLOR });
            }
        }
    }
}
Renderer.singleton = new Renderer();
const renderer = Renderer.singleton;
export { renderer };
