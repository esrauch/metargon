import { camera } from "../coords/camera.js";
import { VPositions, Pos, add, Vec } from "../coords/coords.js";
import { assert } from "../util/util.js";
import { BG_COLOR, DEBUG_COLOR, FG_COLOR, Gfx } from "./gfx.js";

export class Gfx2d implements Gfx {
    public ctx: CanvasRenderingContext2D;
    private w!: number;
    private h!: number;
    private fillStyle?: string;
    private strokeStyle?: string;
    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = assert(canvas.getContext('2d'));
        this.onViewportSizeChange();
    }

    setFillStyle(style: string, opts?: {force: boolean}) {
        if (style !== this.fillStyle || opts?.force) {
            this.ctx.fillStyle = style;
            this.fillStyle = style;
        }
    }

    setStrokeStyle(style: string, opts?: {force: boolean}) {
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
        this.setFillStyle(FG_COLOR, {force: true});
        this.setStrokeStyle(FG_COLOR, {force: true});
        this.ctx.lineWidth = 10;
    }

    clearAndSetTransform() {
        const ctx = this.ctx;
        ctx.resetTransform();
        this.setFillStyle(BG_COLOR);
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.setFillStyle('#00f');

        ctx.scale(camera.mult, camera.mult);
        ctx.translate(camera.vleftoff, camera.vtopoff);
    }

    private poly(c: VPositions) {
        for (const p of c.pts) {
            this.ctx.lineTo(p[0], p[1]);
        }
    }

    line(from: Pos, to: Pos, color?: string) {
        const ctx = this.ctx;
        this.setStrokeStyle(color || FG_COLOR);
        ctx.beginPath();
        ctx.lineTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    }

    vector(from: Pos, vec: Vec, color?: string) {
        this.line(from, add(from, vec), color);
    }

    circle(center: Pos, radius: number, color?: string): void {
        this.setFillStyle(color || FG_COLOR);
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.fill()
    }

    linestrip(c: VPositions, color?: string) {
        this.setStrokeStyle(color || FG_COLOR);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.stroke();
    }

    lineloop(c: VPositions, color?: string) {
        this.setStrokeStyle(color || FG_COLOR);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.closePath();
        ctx.stroke();
    }

    filledpoly(c: VPositions, color?: string) {
        this.setFillStyle(color || FG_COLOR);
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.fill();
    }

    text(p: Pos, s: string, color?: string) {
        this.setFillStyle(color || DEBUG_COLOR);
        const c = this.ctx;
        c.fillText(s, p.x, p.y);
    }
}