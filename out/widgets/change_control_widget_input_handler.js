import { InputHandler } from "../input/input.js";
export class ChangeControlWidgetInputHandler extends InputHandler {
    constructor() {
        super(...arguments);
        this.type = 'CHANGE_CONTROL';
    }
}
