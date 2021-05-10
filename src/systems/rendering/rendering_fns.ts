import { getActiveControlName } from "../../controls/controls.js";
import { Pos, add } from "../../coords/coords.js";
import { COLORS, Gfx } from "../../gfx/gfx.js";
import { Id } from "../../payloads/entity_id.js";
import { RenderingPayload, Primitive, ControlButtonRenderingOption } from "../../payloads/rendering_payload.js";

export type DrawFn = (gfx: Gfx, id: Id, pos: Pos) => void;

export function makeRenderingFn(value: RenderingPayload): DrawFn {
    switch(value.type) {
        case 'FUNCTION':
            return value.fn;
        case 'CUSTOM':
            return (gfx, id, pos) => value.obj.draw(gfx, id, pos);
        case 'COMPOUND':
            return makeCompoundRenderingFn(value.prims);
        case 'CONTROL_BUTTON':
            return makeControlButtonRenderingFn(value);
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

function makeControlButtonRenderingFn(value: ControlButtonRenderingOption): DrawFn {
    return (gfx, id, pos) => {
        const color = value.controlName == getActiveControlName()
            ? COLORS.WATER : COLORS.BG_MILD;
        gfx.strokerect(pos, value.w, value.w, color);
        gfx.text(pos, 'X', { size: value.w, color} );
    };
}

