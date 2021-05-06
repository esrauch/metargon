

import { SPos, delta, SVec } from "../coords/coords.js";
import { AbstractPointerEvtControl } from "./pointer_helper.js";

export class MagnetControl extends AbstractPointerEvtControl {
    startPosition?: SPos;
    vector?: SVec;

    constructor(
        readonly onUpdateCallback: (pos: SPos, vec: SVec) => void,
        readonly onReleaseCallback: (pos: SPos, vec: SVec) => void) {
        super();
    }

    onDown(ev: PointerEvent): void {
        this.startPosition = new SPos(ev.clientX, ev.clientY);
    }

    onMove(ev: PointerEvent): void {
        if (!this.startPosition) return;
        const current = new SPos(ev.clientX, ev.clientY);
        this.vector = delta(this.startPosition, current);
        this.onUpdateCallback(this.startPosition, this.vector);
    }

    onUp(ev: PointerEvent): void {
        this.upOrCancel(ev);
    }

    onCancel(ev: PointerEvent): void {
        this.upOrCancel(ev);
    }

    private upOrCancel(ev: PointerEvent) {
        if (this.startPosition && this.vector) {
            this.onReleaseCallback(this.startPosition, this.vector);
        }
        this.startPosition = undefined;
        this.vector = undefined;
    }
}