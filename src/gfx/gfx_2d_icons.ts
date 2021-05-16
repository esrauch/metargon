import { Pos } from "../coords/coords.js";
import { Icon } from "../payloads/rendering_payload.js";
import { assertUnreachable } from "../util/assert.js";


export function drawIcon(ctx: CanvasRenderingContext2D, icon: Icon, pos: Pos, w: number): void {
    switch (icon) {
        case Icon.SPIN: spinIcon(ctx, pos, w); return;
    }
    return assertUnreachable(icon);
}

function spinIcon(ctx: CanvasRenderingContext2D, pos: Pos, w: number) {
    const x = pos.x;
    const y = pos.y;
    const tw = w * 0.1; // Tenth of a width
    const cr = w * 0.4; // Circle Radius
    /*
    x.clearRect(0,0,1000,1000);
    x.beginPath(); x.arc(500,500,400,0,Math.PI*2); x.stroke();
    x.beginPath(); x.moveTo(800,500); x.lineTo(1000,500); x.lineTo(900,600); x.fill();
    x.beginPath(); x.moveTo(500,800); x.lineTo(500,1000); x.lineTo(400,900); x.fill();
    x.beginPath(); x.moveTo(0,500); x.lineTo(200,500); x.lineTo(100,400); x.fill();
    x.beginPath(); x.moveTo(500,0); x.lineTo(500,200); x.lineTo(600,100); x.fill();
    */
    ctx.beginPath(); ctx.rect(x - w/2, y - w/2, w, w); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, cr, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + cr - tw, y); ctx.lineTo(x + cr + tw, y); ctx.lineTo(x + cr, y + tw); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x, y - tw + cr); ctx.lineTo(x, y + tw + cr); ctx.lineTo(x - tw, y + cr); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - cr - tw, y); ctx.lineTo(x - cr + tw, y); ctx.lineTo(x - cr, y - tw); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x, y - cr - tw); ctx.lineTo(x, y - cr + tw); ctx.lineTo(x + tw, y - cr); ctx.fill();
}
