import { BusEvent, BusListener } from "../bus/bus.js";
import { DrawEvent } from "../bus/events/draw.js";
import { add, Pos, VPositions } from "../coords/coords.js";
import { Id } from "../entity/entity_id.js";
import { idTable } from "../entity/id_table.js";
import { labelTable } from "../entity/label_table.js";
import { Gfx } from "../gfx/gfx.js";
import { getCenterPosition } from "../util/get_position.js";
import { EntityRenderingOptions, Primitive } from "./entity_rendering_options.js";

type DrawFn = (gfx: Gfx, pos: Pos) => void;

function makeRenderingFn(ero: EntityRenderingOptions): DrawFn {
    switch(ero.type) {
        case 'CUSTOM':
            return ero.fn;
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
                case 'RECT':
                    const halfw = p.width / 2;
                    const halfh = p.height / 2;
                    const top = pos.y - halfh;
                    const right = pos.x + halfw;
                    const bottom = pos.y + halfh;
                    const left = pos.x - halfw;
                    gfx.filledpoly(new VPositions([
                        [left, top],
                        [right, top],
                        [right, bottom],
                        [left, bottom],
                    ]));
                    break;
            }
        }
    };
}


export class Renderer implements BusListener {
    readonly debugUi = {
        disableNormalRendering: false,
        renderLabels: true,
        renderIds: true,
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

    draw(ev: DrawEvent) {
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
                gfx.text(pos, debugString);
            }
        }
    }
}

const renderer = Renderer.singleton;
export { renderer };
