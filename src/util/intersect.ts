import { Pos } from "../coords/coords.js";
import { PositionedRect } from "../coords/rect.js";

export function rectContains(
    center: Pos,
    w: number,
    h: number,
    test: Pos): boolean {
    return new PositionedRect(center, w, h).contains(test);
}

