// A concrete Gfx implementation that does absolutely nothing.
export class GfxNull {
    onViewportSizeChange() { }
    clearAndSetTransform() { }
    line(from, to) { }
    linestrip(c) { }
    lineloop(c) { }
    filledpoly(c) { }
    circle(center, radius) {
    }
}
