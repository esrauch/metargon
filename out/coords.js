export const VWIDTH = 2000;
export const VHEIGHT = 3000;
export class Camera {
    // The mapping from VirtualPos to Screen
    constructor(mult, vleftoff, vtopoff) {
        this.mult = mult;
        this.vleftoff = vleftoff;
        this.vtopoff = vtopoff;
    }
    static makeFromScreenDims(swidth, sheight) {
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
        return new Camera(mult, leftoff, topoff);
    }
}
