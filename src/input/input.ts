import { Pos } from "../coords/coords.js";
import { widgetTable } from "../systems/widget_table.js";
import { PointerEvtControl } from "./pointer_helper.js";

export class InputHandler {
    onDown(pos: Pos): void {}
    onMove(pos: Pos): void {}
    onUp(pos: Pos): void {}
    onCancel(): void {}

    onKeyDown(key: string): void {}
}

export class Input extends PointerEvtControl {
    private constructor() {
        super();
    }
    static singleton = new Input();
    private activeHandler?: InputHandler;

    private fallbackHandler?: InputHandler;

    setFallbackInputHandler(fallbackHandler?: InputHandler) {
        this.fallbackHandler = fallbackHandler;
    }

    onDown(pos: Pos): void {
        this.activeHandler?.onCancel();

        // See if we hit a Widget handler.
        const widget = widgetTable.hitTest(pos);
        if (widget) {
            // this.activeHandler = widget;
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

    onKeyPress(): void {}
}

const input = Input.singleton;
export {input};