
// A generic control mode where the user drags at an arbitrary point to decide a vector
// that points in the opposite direction.
// For example, a GolfControl uses this to apply a force to a given object.

import { delta, Pos, Vec } from "../coords/coords.js";
import { Control } from "./control.js";

export abstract class VectorControl extends Control {
    startPosition?: Pos;
    vector?: Vec;

    constructor() {
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
        this.onVectorUpdate(this.startPosition, this.vector);
    }

    onUp(pos: Pos): void {
        if (this.startPosition && this.vector) {
            this.onVectorRelease(this.startPosition, this.vector);
        }
        this.reset();
    }

    onCancel(): void {
        if (this.startPosition && this.vector) {
            this.onVectorCancel();
        }
        this.reset();
    }

    private reset() {
        this.startPosition = undefined;
        this.vector = undefined;
    }

    abstract onVectorUpdate(pos: Pos, vec: Vec): void;
    abstract onVectorRelease(pos: Pos, vec: Vec): void;
    abstract onVectorCancel(): void;
}