
// A generic control mode where the user drags at an arbitrary point to decide a vector
// that points in the opposite direction.
// For example, a GolfControl uses this to apply a force to a given object.

import { camera } from "../coords/camera.js";
import { SPos, delta, Pos, Vec } from "../coords/coords.js";
import { AbstractPointerEvtControl } from "./pointer_helper.js";

export class VectorControl extends AbstractPointerEvtControl {
    startPosition?: Pos;
    vector?: Vec;

    constructor(
        readonly onUpdateCallback: (pos: Pos, vec: Vec) => void,
        readonly onReleaseCallback: (pos: Pos, vec: Vec) => void,
        readonly onCancelCallback: () => void) {
        super();
    }

    onDown(ev: PointerEvent): void {
        this.reset();
        this.startPosition = 
            camera.toVirtualPos(new SPos(ev.clientX, ev.clientY));
    }

    onMove(ev: PointerEvent): void {
        if (!this.startPosition) return;
        const current = camera.toVirtualPos(new SPos(ev.clientX, ev.clientY));
        this.vector = delta(this.startPosition, current);
        this.onUpdateCallback(this.startPosition, this.vector);
    }

    onUp(ev: PointerEvent): void {
        if (this.startPosition && this.vector) {
            this.onReleaseCallback(this.startPosition, this.vector);
        }
        this.reset();
    }

    onCancel(ev: PointerEvent): void {
        if (this.startPosition && this.vector) {
            this.onCancelCallback();
        }
        this.reset();
    }

    private reset() {
        this.startPosition = undefined;
        this.vector = undefined;
    }
}