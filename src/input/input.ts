import { Pos } from "../coords/coords.js";
import { hittest } from "../systems/getters.js";
import { PointerEvtControl } from "./pointer_helper.js";

export interface InputHandlerInterface {
    onDown(pos: Pos): void;
    onMove(pos: Pos): void;
    onUp(pos: Pos): void;
    onCancel(): void;
}
export class InputHandler implements InputHandlerInterface {
    onDown(pos: Pos): void {}
    onMove(pos: Pos): void {}
    onUp(pos: Pos): void {}
    onCancel(): void {}
}

export class Input extends PointerEvtControl {
    private constructor() {
        super();
    }
    static singleton = new Input();

    private activeHandler?: InputHandlerInterface;

    private fallbackHandler?: InputHandlerInterface;

    setFallbackInputHandler(fallbackHandler?: InputHandler) {
        this.fallbackHandler = fallbackHandler;
    }

    onDown(pos: Pos): void {
        this.activeHandler?.onCancel();

        const hitId = hittest(pos);
        if (hitId) {
            hitId.payload.callback();
        } else if (this.fallbackHandler) {
            this.activeHandler = this.fallbackHandler;
        }
        this.activeHandler?.onDown(pos);
    }
    onMove(pos: Pos): void {
        this.activeHandler?.onMove(pos);
    }
    onUp(pos: Pos): void {
        this.activeHandler?.onUp(pos);
        this.activeHandler = undefined;
    }
    onCancel(): void {
        this.activeHandler?.onCancel();
        this.activeHandler = undefined;
    }
}

const input = Input.singleton;
export {input};