import { Vec } from "../coords/coords.js";
import { Gfx } from "../gfx/gfx.js";

export type EntityRenderingOptions =
    {
        type: 'CIRCLE',
        radius: number,
    } |
    {
        type: 'LINE',
        vec: Vec,
    } |
    {
        type: 'RECT',
        width: number,
        height: number,
    } |
    {
        type: 'CUSTOM',
        draw: (gfx: Gfx) => void,
    };