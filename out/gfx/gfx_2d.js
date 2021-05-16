import { camera } from "../coords/camera.js";
import { Positions, add } from "../coords/coords.js";
import { assert } from "../util/assert.js";
import { Color, LINE_WIDTH } from "./gfx.js";
import { drawIcon } from "./gfx_2d_icons.js";
const DEFAULT_FONT_FAMILY = 'Helvetica, Arial, Sans-Serif';
const DEFAULT_FONT_SIZE = 100;
function toFont(size = DEFAULT_FONT_SIZE, font = DEFAULT_FONT_FAMILY) {
    return `${size}px ${font}`;
}
export class Gfx2d {
    constructor(canvas) {
        this.canvas = canvas;
        this.globalOpacity = 1;
        this.forcedFgColor = undefined;
        this.framecount = 0;
        this.sizeCache = new Map();
        this.ctx = assert(canvas.getContext('2d'));
        this.onViewportSizeChange();
    }
    setGlobalOpacity(opacity) {
        this.globalOpacity = opacity;
    }
    forceForegroundColor(color) {
        this.forcedFgColor = color;
    }
    setFillStyle(color, opts) {
        if (color && (opts === null || opts === void 0 ? void 0 : opts.force)) {
            this.ctx.fillStyle = color;
            this.fillStyle = color;
            return;
        }
        const style = this.forcedFgColor || color || Color.FG;
        if (style !== this.fillStyle) {
            this.ctx.fillStyle = style;
            this.fillStyle = style;
        }
    }
    setStrokeStyle(color, opts) {
        if (color && (opts === null || opts === void 0 ? void 0 : opts.force)) {
            this.ctx.strokeStyle = color;
            this.strokeStyle = color;
            return;
        }
        const style = this.forcedFgColor || color || Color.FG;
        if (style !== this.strokeStyle) {
            this.ctx.strokeStyle = style;
            this.strokeStyle = style;
        }
    }
    onViewportSizeChange() {
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.ctx.font = toFont();
        this.setFillStyle(Color.FG, { force: true });
        this.setStrokeStyle(Color.FG, { force: true });
        this.ctx.lineWidth = LINE_WIDTH;
    }
    clearAndSetTransform() {
        const ctx = this.ctx;
        ctx.resetTransform();
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.setFillStyle(Color.BG, { force: true });
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
        this.setStrokeStyle(color);
        ctx.beginPath();
        ctx.lineTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }
    vector(from, vec, color) {
        this.line(from, add(from, vec), color);
    }
    circle(center, radius, color) {
        this.setStrokeStyle(color);
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    fillcircle(center, radius, color) {
        this.setFillStyle(color);
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    linestrip(c, color) {
        this.setStrokeStyle(color);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.stroke();
    }
    lineloop(c, color) {
        this.setStrokeStyle(color);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.closePath();
        ctx.stroke();
    }
    filledpoly(c, color) {
        this.setFillStyle(color);
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
        this.setFillStyle(opts === null || opts === void 0 ? void 0 : opts.color);
        const c = this.ctx;
        const fontStr = toFont(opts === null || opts === void 0 ? void 0 : opts.size, opts === null || opts === void 0 ? void 0 : opts.font);
        const metrics = this.setFontAndMeasureText(s, fontStr);
        if (!metrics)
            return;
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
    icon(icon, pos, w, color) {
        this.setStrokeStyle(color);
        this.setFillStyle(color);
        drawIcon(this.ctx, icon, pos, w);
    }
}
