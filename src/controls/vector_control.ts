
// A generic control mode where the user drags at an arbitrary point to decide a vector
// that points in the opposite direction.
// For example, a GolfControl uses this to apply a force to a given object.

import { delta, Pos, Vec } from "../coords/coords.js";
import { PointerEvtControl } from "./pointer_helper.js";

export class VectorControl extends PointerEvtControl {
    startPosition?: Pos;
    vector?: Vec;

    constructor(
        readonly onUpdateCallback: (pos: Pos, vec: Vec) => void,
        readonly onReleaseCallback: (pos: Pos, vec: Vec) => void,
        readonly onCancelCallback: () => void) {
        super();
    }

    onDown(pos: Pos): void {
        this.reset();
        if (pos.isInBounds())
            this.startPosition = pos;
    }

    onMove(pos: Pos): void {
        if (!this.startPosition) return;
        this.vector = delta(this.startPosition, pos);
        this.onUpdateCallback(this.startPosition, this.vector);
    }

    onUp(pos: Pos): void {
        if (this.startPosition && this.vector) {
            this.onReleaseCallback(this.startPosition, this.vector);
        }
        this.reset();
    }

    onCancel(pos: Pos): void {
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