import { getActiveControlName } from "../../controls/controls.js";
import { add } from "../../coords/coords.js";
import { COLORS } from "../../gfx/gfx.js";
export function makeRenderingFn(value) {
    switch (value.type) {
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
function makeControlButtonRenderingFn(value) {
    return (gfx, id, pos) => {
        const color = value.controlName == getActiveControlName()
            ? COLORS.WATER : COLORS.BG_MILD;
        gfx.strokerect(pos, value.w, value.w, color);
        gfx.text(pos, 'X', { size: value.w, color });
    };
}
