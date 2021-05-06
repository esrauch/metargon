import { BusEvent, BusListener } from "../bus/bus.js";
import { DrawEvent } from "../bus/events/draw.js";
import { add, Pos, VPositions } from "../coords/coords.js";
import { Id } from "../entity/entity_id.js";
import { idTable } from "../entity/id_table.js";
import { labelTable } from "../entity/label_table.js";
import { positionTable } from "../entity/position_table.js";
import { EntityRenderingOptions } from "./entity_rendering_options.js";


export class Renderer implements BusListener {
    readonly debugUi = {
        disableNormalRendering: false,
        renderLabels: true,
        renderIds: true,
    };

    private constructor() { }
    static singleton = new Renderer();

    readonly renderingData = new Map<Id, EntityRenderingOptions>();

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                if (ev.rendering_data) {
                    this.renderingData.set(ev.entityId, ev.rendering_data);
                }
                break;
            case 'DESTROY_ENTITY':
                this.renderingData.delete(ev.entityId);
                break;
            case 'DRAW':
                this.draw(ev);
                break;
        }
    }

    draw(ev: DrawEvent) {
        const gfx = ev.gfx;

        if (!this.debugUi.disableNormalRendering) {
            for (const [id, renderingData] of this.renderingData) {
                const pos = positionTable.getCenterPosition(id);
                switch (renderingData.type) {
                    case 'CIRCLE':
                        gfx.circle(pos, renderingData.radius);
                        break;
                    case 'LINE':
                        const to = add(pos, renderingData.vec);
                        gfx.line(pos, to);
                        break;
                    case 'RECT':
                        const halfw = renderingData.width / 2;
                        const halfh = renderingData.height / 2;
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
                    case 'CUSTOM':
                        renderingData.draw(gfx);
                }
            }
        }

        if (this.debugUi.renderLabels || this.debugUi.renderIds) {
            for (const id of idTable.allIds()) {
                const pos = positionTable.getCenterPosition(id);
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
