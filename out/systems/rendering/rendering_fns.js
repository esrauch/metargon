import { add } from "../../coords/coords.js";
import { tilt } from "../../input/tilt.js";
import { assertUnreachable } from "../../util/assert.js";
import { getCenterPosition } from "../getters.js";
import { physics } from "../physics/physics.js";
export function makeRenderingFn(value) {
    switch (value.type) {
        case 'FUNCTION':
            return value.fn;
        case 'CUSTOM':
            return (gfx, id, pos) => value.obj.draw(gfx, id, pos);
        case 'COMPOUND':
            return makeCompoundRenderingFn(value.prims);
        case 'CONDITIONAL':
            return makeConditionalRenderingFn(value);
        default:
            return makeCompoundRenderingFn([value]);
    }
}
function makeConditionalRenderingFn(value) {
    const ifTrueFn = makeRenderingFn(value.ifTrue);
    const ifFalsefn = makeRenderingFn(value.ifFalse);
    return (gfx, id, pos) => {
        value.cond() ? ifTrueFn(gfx, id, pos) : ifFalsefn(gfx, id, pos);
    };
}
function makeCompoundRenderingFn(prims) {
    return (gfx, id, pos) => {
        for (const p of prims) {
            switch (p.type) {
                case 'CIRCLE':
                    gfx.circle(pos, p.radius, p.color);
                    break;
                case 'LINE':
                    const to = add(pos, p.vec);
                    gfx.line(pos, to, p.color);
                    break;
                case 'LINELOOP':
                    // TODO: offset pts by pos
                    gfx.lineloop(p.pts, p.color);
                    break;
                case 'RECT':
                    if (p.filled) {
                        gfx.fillrect(pos, p.width, p.height, p.color);
                    }
                    else {
                        gfx.strokerect(pos, p.width, p.height, p.color);
                    }
                    break;
                case 'TEXT':
                    gfx.text(pos, p.text, {
                        color: p.color,
                        size: p.size,
                        font: p.font,
                    });
                    break;
                case 'BOXED_TEXT':
                    gfx.strokerect(pos, p.boxW, p.boxH, p.color);
                    gfx.text(pos, p.text, {
                        color: p.color,
                        size: p.fontSize,
                    });
                    break;
                case 'ICON':
                    gfx.icon(p.icon, pos, p.w, p.color);
                    break;
                case 'PHYSICS_HULL':
                    const poly = physics.getHullPoly(id);
                    if (poly)
                        gfx.filledpoly(poly, p.color);
                    break;
                case 'CONNECTOR':
                    const other = getCenterPosition(p.otherEntity);
                    if (!other)
                        return;
                    gfx.line(pos, other, p.color);
                    break;
                case 'TILT_INDICATOR':
                    gfx.strokecircle(pos, p.r, p.color);
                    const v = tilt.dir.mult(p.r);
                    gfx.circle(add(pos, v), 50, p.color);
                    break;
                default:
                    assertUnreachable(p);
            }
        }
    };
}
