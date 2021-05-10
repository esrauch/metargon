import { camera } from "../coords/camera.js";
export class PointerEvtControl {
    constructor() {
        this.el = document.body;
        this.OPTS = { passive: true };
        // Wrap all of the event methods so that we can unregister them,
        // as well as automatically doing pointer capture on down and up/cancel.
        this.downWrapper = (ev) => {
            if (this.activePointerId !== undefined)
                return;
            this.activePointerId = ev.pointerId;
            this.el.setPointerCapture(ev.pointerId);
            this.onDown(camera.toVirtualPosXy(ev.clientX, ev.clientY));
        };
        this.moveWrapper = (ev) => {
            if (this.activePointerId !== ev.pointerId)
                return;
            this.onMove(camera.toVirtualPosXy(ev.clientX, ev.clientY));
        };
        this.upWrapper = (ev) => {
            if (this.activePointerId !== ev.pointerId)
                return;
            this.activePointerId = undefined;
            this.el.releasePointerCapture(ev.pointerId);
            this.onUp(camera.toVirtualPosXy(ev.clientX, ev.clientY));
        };
        this.cancelWrapper = (ev) => {
            this.activePointerId = undefined;
            this.el.releasePointerCapture(ev.pointerId);
            this.onCancel(camera.toVirtualPosXy(ev.clientX, ev.clientY));
        };
    }
    enable() {
        const o = this.OPTS;
        this.el.addEventListener('pointerdown', this.downWrapper, o);
        this.el.addEventListener('pointermove', this.moveWrapper, o);
        this.el.addEventListener('pointerup', this.upWrapper, o);
        this.el.addEventListener('pointercancel', this.cancelWrapper, o);
    }
    disable() {
        const o = this.OPTS;
        this.el.removeEventListener('pointerdown', this.downWrapper, o);
        this.el.removeEventListener('pointermove', this.moveWrapper, o);
        this.el.removeEventListener('pointerup', this.upWrapper, o);
        this.el.removeEventListener('pointercancel', this.cancelWrapper, o);
    }
}
