

import { delta, Pos, Vec } from "../coords/coords.js";
import { PointerEvtControl } from "./pointer_helper.js";

export class MagnetControl extends PointerEvtControl {
    startPosition?: Pos;
    vector?: Vec;

    constructor(
        readonly onUpdateCallback: (pos: Pos, vec: Vec) => void,
        readonly onReleaseCallback: (pos: Pos, vec: Vec) => void) {
        super();
    }

    onDown(pos: Pos): void {
        this.startPosition = pos;
    }

    onMove(pos: Pos): void {
        if (!this.startPosition) return;
        const current = pos;
        this.vector = delta(this.startPosition, current);
        this.onUpdateCallback(this.startPosition, this.vector);
    }

    onUp(pos: Pos): void {
        this.upOrCancel();
    }

    onCancel(pos: Pos): void {
        this.upOrCancel();
    }

    private upOrCancel() {
        if (this.startPosition && this.vector) {
            this.onReleaseCallback(this.startPosition, this.vector);
        }
        this.startPosition = undefined;
        this.vector = undefined;
    }
}