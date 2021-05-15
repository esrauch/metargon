import { ControlName, controls, getActiveControlName } from "../../controls/controls.js";
import { Pos, add } from "../../coords/coords.js";
import { COLOR, Gfx } from "../../gfx/gfx.js";
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
                    gfx.strokerect(pos, p.width, p.height, p.color);
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

function dispCharacterForControl(control: ControlName): string {
    switch(control) {
        case 'BALL': return 'O';
        case 'FLAPPY': return 'F';
        case 'GOLF_FORCE': return 'G';
        case 'GOLF_VELOCITY': return 'V';
        case 'ROLL': return 'R';
    }
}

function makeControlButtonRenderingFn(value: ControlButtonRenderingOption): DrawFn {
    const control = value.controlName;
    return (gfx, id, pos) => {
        const color = control == getActiveControlName()
            ? COLOR.WATER : COLOR.BG_MILD;
        gfx.strokerect(pos, value.w, value.w, color);

        const dispChar = dispCharacterForControl(control)
        gfx.text(pos, dispChar, { size: value.w, color} );
    };
}

