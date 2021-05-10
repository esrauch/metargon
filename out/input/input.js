import { hittest } from "../systems/getters.js";
import { PointerEvtControl } from "./pointer_helper.js";
export class InputHandler {
    onDown(pos) { }
    onMove(pos) { }
    onUp(pos) { }
    onCancel() { }
}
export class Input extends PointerEvtControl {
    constructor() {
        super();
    }
    setFallbackInputHandler(fallbackHandler) {
        this.fallbackHandler = fallbackHandler;
    }
    onDown(pos) {
        var _a, _b;
        (_a = this.activeHandler) === null || _a === void 0 ? void 0 : _a.onCancel();
        const hitId = hittest(pos);
        if (hitId) {
            hitId.payload.callback();
        }
        else if (this.fallbackHandler) {
            this.activeHandler = this.fallbackHandler;
        }
        (_b = this.activeHandler) === null || _b === void 0 ? void 0 : _b.onDown(pos);
    }
    onMove(pos) {
        var _a;
        (_a = this.activeHandler) === null || _a === void 0 ? void 0 : _a.onMove(pos);
    }
    onUp(pos) {
        var _a;
        (_a = this.activeHandler) === null || _a === void 0 ? void 0 : _a.onUp(pos);
        this.activeHandler = undefined;
    }
    onCancel() {
        var _a;
        (_a = this.activeHandler) === null || _a === void 0 ? void 0 : _a.onCancel();
        this.activeHandler = undefined;
    }
}
Input.singleton = new Input();
const input = Input.singleton;
export { input };
