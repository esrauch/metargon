import { camera } from "../coords/camera.js";
import { Positions, add } from "../coords/coords.js";
import { assert } from "../util/assert.js";
import { COLORS } from "./gfx.js";
const DEFAULT_FONT = '100px sans-serif';
function toFont(size, font) {
    if (!size)
        return DEFAULT_FONT;
    return `${size}px '${font || 'sans-serif'}`;
}
export class Gfx2d {
    constructor(canvas) {
        this.canvas = canvas;
        this.globalOpacity = 1;
        this.framecount = 0;
        this.sizeCache = new Map();
        this.ctx = assert(canvas.getContext('2d'));
        this.onViewportSizeChange();
    }
    setGlobalOpacity(opacity) {
        this.globalOpacity = opacity;
    }
    setFillStyle(style, opts) {
        if (style !== this.fillStyle || (opts === null || opts === void 0 ? void 0 : opts.force)) {
            this.ctx.fillStyle = style;
            this.fillStyle = style;
        }
    }
    setStrokeStyle(style, opts) {
        if (style !== this.strokeStyle || (opts === null || opts === void 0 ? void 0 : opts.force)) {
            this.ctx.strokeStyle = style;
            this.strokeStyle = style;
        }
    }
    onViewportSizeChange() {
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        // This px size is in virt coords.
        this.ctx.font = '100px sans-serif';
        this.setFillStyle(COLORS.FG, { force: true });
        this.setStrokeStyle(COLORS.FG, { force: true });
        this.ctx.lineWidth = 10;
    }
    clearAndSetTransform() {
        const ctx = this.ctx;
        ctx.resetTransform();
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.setFillStyle(COLORS.BG);
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.setFillStyle('#00f');
        ctx.scale(camera.mult, camera.mult);
        ctx.translate(camera.vleftoff, camera.vtopoff);
        this.ctx.globalAlpha = this.globalOpacity;
    }
    poly(c) {
        for (const p of c.pts) {
            this.ctx.lineTo(p[0], p[1]);
        }
    }
    line(from, to, color) {
        const ctx = this.ctx;
        this.setStrokeStyle(color || COLORS.FG);
        ctx.beginPath();
        ctx.lineTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }
    vector(from, vec, color) {
        this.line(from, add(from, vec), color);
    }
    circle(center, radius, color) {
        this.setStrokeStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    linestrip(c, color) {
        this.setStrokeStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.stroke();
    }
    lineloop(c, color) {
        this.setStrokeStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.closePath();
        ctx.stroke();
    }
    filledpoly(c, color) {
        this.setFillStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.fill();
    }
    fillrect(center, w, h, color) {
        const L = center.x - w / 2;
        const R = center.x + w / 2;
        const T = center.y - h / 2;
        const B = center.y + h / 2;
        this.filledpoly(new Positions([
            [L, T],
            [R, T],
            [R, B],
            [L, B],
        ]), color);
    }
    strokerect(center, w, h, color) {
        const L = center.x - w / 2;
        const R = center.x + w / 2;
        const T = center.y - h / 2;
        const B = center.y + h / 2;
        this.lineloop(new Positions([
            [L, T],
            [R, T],
            [R, B],
            [L, B],
        ]), color);
    }
    text(p, s, opts) {
        this.setFillStyle((opts === null || opts === void 0 ? void 0 : opts.color) || COLORS.FG);
        const c = this.ctx;
        const fontStr = toFont(opts === null || opts === void 0 ? void 0 : opts.size, opts === null || opts === void 0 ? void 0 : opts.font);
        const metrics = this.setFontAndMeasureText(s, fontStr);
        const w = metrics.width;
        c.fillText(s, p.x - metrics.width / 2, p.y + metrics.actualBoundingBoxAscent / 2);
    }
    setFontAndMeasureText(s, font) {
        const c = this.ctx;
        c.font = font;
        // To avoid some bad edge case of growing without bounds,
        // clear out the cache after we hit 100 measurements.
        if (this.sizeCache.size > 100)
            this.sizeCache.clear();
        let perFontCache = this.sizeCache.get(font);
        if (!perFontCache) {
            perFontCache = new Map();
            this.sizeCache.set(font, perFontCache);
        }
        let cachedMetrics = perFontCache.get(s);
        if (!cachedMetrics) {
            const metrics = c.measureText(s);
            perFontCache.set(s, metrics);
            return metrics;
        }
        return cachedMetrics;
    }
}
