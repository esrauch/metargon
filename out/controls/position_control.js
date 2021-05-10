import { delta } from "../coords/coords.js";
import { PointerEvtControl } from "./pointer_helper.js";
export class MagnetControl extends PointerEvtControl {
    constructor(onUpdateCallback, onReleaseCallback) {
        super();
        this.onUpdateCallback = onUpdateCallback;
        this.onReleaseCallback = onReleaseCallback;
    }
    onDown(pos) {
        this.startPosition = pos;
    }
    onMove(pos) {
        if (!this.startPosition)
            return;
        const current = pos;
        this.vector = delta(this.startPosition, current);
        this.onUpdateCallback(this.startPosition, this.vector);
    }
    onUp(pos) {
        this.upOrCancel();
    }
    onCancel(pos) {
        this.upOrCancel();
    }
    upOrCancel() {
        if (this.startPosition && this.vector) {
            this.onReleaseCallback(this.startPosition, this.vector);
        }
        this.startPosition = undefined;
        this.vector = undefined;
    }
}
