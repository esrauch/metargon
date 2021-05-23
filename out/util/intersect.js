import { PositionedRect } from "../coords/rect.js";
export function rectContains(center, w, h, test) {
    return new PositionedRect(center, w, h).contains(test);
}
