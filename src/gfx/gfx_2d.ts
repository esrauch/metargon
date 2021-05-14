import { camera } from "../coords/camera.js";
import { Positions, Pos, add, Vec } from "../coords/coords.js";
import { assert } from "../util/assert.js";
import { COLORS, Gfx } from "./gfx.js";

const DEFAULT_FONT = '100px sans-serif';

function toFont(size?: number, font?: string): string {
    if (!size) return DEFAULT_FONT;
    return `${size}px '${font || 'sans-serif'}`;
}

export class Gfx2d implements Gfx {
    public ctx: CanvasRenderingContext2D;
    private w!: number;
    private h!: number;
    private fillStyle?: string;
    private strokeStyle?: string;
    private globalOpacity = 1;
    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = assert(canvas.getContext('2d'));
        this.onViewportSizeChange();
    }

    setGlobalOpacity(opacity: number) {
        this.globalOpacity = opacity;
    }

    setFillStyle(style: string, opts?: { force: boolean }) {
        if (style !== this.fillStyle || opts?.force) {
            this.ctx.fillStyle = style;
            this.fillStyle = style;
        }
    }

    setStrokeStyle(style: string, opts?: { force: boolean }) {
        if (style !== this.strokeStyle || opts?.force) {
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

    private framecount = 0;

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

    private poly(c: Positions) {
        for (const p of c.pts) {
            this.ctx.lineTo(p[0], p[1]);
        }
    }

    line(from: Pos, to: Pos, color?: string) {
        const ctx = this.ctx;
        this.setStrokeStyle(color || COLORS.FG);
        ctx.beginPath();
        ctx.lineTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    vector(from: Pos, vec: Vec, color?: string) {
        this.line(from, add(from, vec), color);
    }

    circle(center: Pos, radius: number, color?: string): void {
        this.setStrokeStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.stroke()
    }

    fillcircle(center: Pos, radius: number, color?: string): void {
        this.setFillStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.fill()
    }

    linestrip(c: Positions, color?: string) {
        this.setStrokeStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.stroke();
    }

    lineloop(c: Positions, color?: string) {
        this.setStrokeStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.closePath();
        ctx.stroke();
    }

    filledpoly(c: Positions, color?: string) {
        this.setFillStyle(color || COLORS.FG);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.fill();
    }

    fillrect(center: Pos, w: number, h: number, color?: string): void {
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

    strokerect(center: Pos, w: number, h: number, color?: string): void {
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
    
    private i = 0;

    text(p: Pos, s: string, opts?: {
        color?: string
        size?: number,
        font?: string,
    }) {
        this.setFillStyle(opts?.color || COLORS.FG);
        const c = this.ctx;
        const fontStr = toFont(opts?.size, opts?.font);
        const metrics = this.setFontAndMeasureText(s, fontStr);
        if (!metrics) return;
        const w = metrics.width;
        if (this.i++ < 100)
            console.log(s,p.x - metrics.width / 2, p.y + metrics.actualBoundingBoxAscent / 2);
        c.fillText(s, p.x - metrics.width / 2, p.y + metrics.actualBoundingBoxAscent / 2);
    }

    private sizeCache = new Map<string, Map<string, TextMetrics>>();
    private setFontAndMeasureText(s: string, font: string) {
        const c = this.ctx;
        c.font = font;

        // To avoid some bad edge case of growing without bounds,
        // clear out the cache after we hit 100 measurements.
        if (this.sizeCache.size > 100) this.sizeCache.clear();

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