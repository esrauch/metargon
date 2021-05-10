import { camera } from "../coords/camera.js";
import { Pos } from "../coords/coords.js";

export abstract class PointerEvtControl {
    private el = document.querySelector('canvas')!;
    private activePointerId?: number;

    // private OPTS: AddEventListenerOptions = {passive: true};
    private OPTS = undefined;
    // Wrap all of the event methods so that we can unregister them,
    // as well as automatically doing pointer capture on down and up/cancel.
    private downWrapper = (ev: PointerEvent) => {
        if (this.activePointerId !== undefined) return;
        this.activePointerId = ev.pointerId;
        this.el.setPointerCapture(ev.pointerId);
        this.onDown(camera.toVirtualPosXy(ev.clientX, ev.clientY));
    }
    private moveWrapper = (ev: PointerEvent) => {
        if (this.activePointerId !== ev.pointerId) return;
        this.onMove(camera.toVirtualPosXy(ev.clientX, ev.clientY));
    }
    private upWrapper = (ev: PointerEvent) => {
        if (this.activePointerId !== ev.pointerId) return;
        this.activePointerId = undefined;
        // this.el.releasePointerCapture(ev.pointerId);
        this.onUp(camera.toVirtualPosXy(ev.clientX, ev.clientY));
    }
    private cancelWrapper = (ev: PointerEvent) => {
        this.activePointerId = undefined;
        // this.el.releasePointerCapture(ev.pointerId);
        this.onCancel();
    }

    enable() {
        const o = this.OPTS;
        this.el.addEventListener('pointerdown', this.downWrapper, o);
        this.el.addEventListener('pointermove', this.moveWrapper, o);
        this.el.addEventListener('pointerup', this.upWrapper,o);
        this.el.addEventListener('pointercancel', this.cancelWrapper, o);
    }

    abstract onDown(pos: Pos): void;
    abstract onMove(pos: Pos): void;
    abstract onUp(pos: Pos): void;
    abstract onCancel(): void;
}