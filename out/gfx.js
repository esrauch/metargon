import { assert } from "./util.js";
const Colors = {
    BLACK: '#000',
    RED: '#FF9AA2',
    ORANGE: '#FFB7B2',
    GREEN: '#E2F0CB',
    BLUE: '#D4F0F0',
    PURPLE: '#C7CEEA',
};
const BG_COLOR = Colors.BLACK;
const FG_COLOR = Colors.BLUE;
export class Gfx2d {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = assert(canvas.getContext('2d'));
        this.onViewportSizeChange();
    }
    onViewportSizeChange() {
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.ctx.fillStyle = FG_COLOR;
        this.ctx.strokeStyle = FG_COLOR;
        this.ctx.lineWidth = 5;
    }
    clearAndSetTransform(c) {
        const ctx = this.ctx;
        ctx.resetTransform();
        this.ctx.fillStyle = BG_COLOR;
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = FG_COLOR;
        ctx.scale(c.mult, c.mult);
        ctx.translate(c.vleftoff, c.vtopoff);
    }
    poly(c) {
        for (const p of c.pts) {
            this.ctx.lineTo(p[0], p[1]);
        }
    }
    linestrip(c) {
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.stroke();
    }
    lineloop(c) {
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.closePath();
        ctx.stroke();
    }
    filledpoly(c) {
        const ctx = this.ctx;
        ctx.beginPath();
        this.poly(c);
        ctx.fill();
    }
}
