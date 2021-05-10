import { SPos, SVec, VHEIGHT, Pos, Vec, VWIDTH } from "./coords.js";
export class Camera {
    // The mapping from VirtualPos to Screen
    constructor(mult, vleftoff, vtopoff) {
        this.mult = mult;
        this.vleftoff = vleftoff;
        this.vtopoff = vtopoff;
    }
    onViewportSizeChange(swidth, sheight) {
        const virtualAspect = VWIDTH / VHEIGHT;
        // screen coords is arbitrary dimensions of the actual browser:
        const screenAspect = swidth / sheight;
        let mult = 0;
        let leftoff = 0;
        let topoff = 0;
        if (screenAspect < virtualAspect) {
            // If we're "too tall" for 2:3 then we primarily letterbox
            // since width constrains the size of the view
            mult = swidth / VWIDTH;
        }
        else {
            // Exact matching or "too wide" is handled here.
            // This is the square-window or landscape-window case: we primarily
            // pillarbox here. That means height is the constraint not width.
            mult = sheight / VHEIGHT;
        }
        mult *= 0.91; // Zoom out precisely one smidge more.
        const fullHeightInvirtualSpace = sheight / mult;
        topoff = (fullHeightInvirtualSpace - VHEIGHT) / 2;
        const fullWidthInVirtualSpace = swidth / mult;
        leftoff = (fullWidthInVirtualSpace - VWIDTH) / 2;
        this.mult = mult;
        this.vleftoff = leftoff;
        this.vtopoff = topoff;
    }
    toScreenPos(vpos) {
        return new SPos((vpos.x + this.vleftoff) * this.mult, (vpos.y + this.vtopoff) * this.mult);
    }
    toScreenVec(vpos) {
        return new SVec(vpos.dx * this.mult, vpos.dy * this.mult);
    }
    toVirtualPos(spos) {
        return new Pos((spos.x / this.mult) - this.vleftoff, (spos.y / this.mult) - this.vtopoff);
    }
    toVirtualPosXy(sx, sy) {
        return new Pos((sx / this.mult) - this.vleftoff, (sy / this.mult) - this.vtopoff);
    }
    toVirtualVec(spos) {
        return new Vec((spos.dx / this.mult), (spos.dy / this.mult));
    }
}
// We have a global singleton Camera.
Camera.singleton = new Camera(0, 0, 0);
const camera = Camera.singleton;
export { camera };
