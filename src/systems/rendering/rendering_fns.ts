import { Pos, add, Positions } from "../../coords/coords.js";
import { Gfx } from "../../gfx/gfx.js";
import { Id } from "../../payloads/entity_id.js";
import { RenderingPayload, Primitive, ConditionalRenderingOption, Icon, } from "../../payloads/rendering_payload.js";
import { assertUnreachable } from "../../util/assert.js";
import { physics } from "../physics/physics.js";

export type DrawFn = (gfx: Gfx, id: Id, pos: Pos) => void;

export function makeRenderingFn(value: RenderingPayload): DrawFn {
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

function makeConditionalRenderingFn(value: ConditionalRenderingOption): DrawFn {
    const ifTrueFn = makeRenderingFn(value.ifTrue);
    const ifFalsefn = makeRenderingFn(value.ifFalse);
    return (gfx: Gfx, id: Id, pos: Pos) => {
        value.cond() ? ifTrueFn(gfx, id, pos) : ifFalsefn(gfx, id, pos);
    };
}

function makeCompoundRenderingFn(prims: Primitive[]): DrawFn {
    return (gfx: Gfx, id: Id, pos: Pos) => {
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
                    } else {
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
                    })
                    break;
                case 'ICON':
                    gfx.icon(p.icon, pos, p.w, p.color);
                    break;
                case 'PHYSICS_HULL':
                    const poly = physics.getHullPoly(id);
                    if (poly) gfx.filledpoly(poly, p.color);
                    break;
                default:
                    assertUnreachable(p);
            }
        }
    };
}

