
export abstract class AbstractPointerEvtControl implements Control {
    private el = document.body;

    private OPTS: AddEventListenerOptions = {passive: true};
    // Wrap all of the event methods so that we can unregister them,
    // as well as automatically doing pointer capture on down and up/cancel.
    private downWrapper = (ev: PointerEvent) => {
        this.el.setPointerCapture(ev.pointerId);
        this.onDown(ev);
    }
    private moveWrapper = (ev: PointerEvent) => this.onMove(ev);
    private upWrapper = (ev: PointerEvent) => {
        this.el.releasePointerCapture(ev.pointerId);
        this.onUp(ev);
    }
    private cancelWrapper = (ev: PointerEvent) => {
        this.el.releasePointerCapture(ev.pointerId);
        this.onCancel(ev);
    }

    enable() {
        const o = this.OPTS;
        this.el.addEventListener('pointerdown', this.downWrapper, o);
        this.el.addEventListener('pointermove', this.moveWrapper, o);
        this.el.addEventListener('pointerup', this.upWrapper,o);
        this.el.addEventListener('pointercancel', this.cancelWrapper, o);
    }

    disable() {
        const o = this.OPTS;
        this.el.removeEventListener('pointerdown', this.downWrapper, o);
        this.el.removeEventListener('pointermove', this.moveWrapper, o);
        this.el.removeEventListener('pointerup', this.upWrapper, o);
        this.el.removeEventListener('pointercancel', this.cancelWrapper, o);
    }

    abstract onDown(ev: PointerEvent): void;
    abstract onMove(ev: PointerEvent): void;
    abstract onUp(ev: PointerEvent): void;
    abstract onCancel(ev: PointerEvent): void;
}
