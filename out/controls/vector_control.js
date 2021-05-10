// A generic control mode where the user drags at an arbitrary point to decide a vector
// that points in the opposite direction.
// For example, a GolfControl uses this to apply a force to a given object.
import { delta } from "../coords/coords.js";
import { Control } from "./control.js";
export class VectorControl extends Control {
    constructor() {
        super();
    }
    onDown(pos) {
        this.reset();
        if (pos.isInBounds())
            this.startPosition = pos;
    }
    onMove(pos) {
        if (!this.startPosition)
            return;
        this.vector = delta(this.startPosition, pos);
        this.onVectorUpdate(this.startPosition, this.vector);
    }
    onUp(pos) {
        if (this.startPosition && this.vector) {
            this.onVectorRelease(this.startPosition, this.vector);
        }
        this.reset();
    }
    onCancel() {
        if (this.startPosition && this.vector) {
            this.onVectorCancel();
        }
        this.reset();
    }
    reset() {
        this.startPosition = undefined;
        this.vector = undefined;
    }
}
