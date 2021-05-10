import { Widget } from "./widgets.js";
export class ChessWidgetSpecificData {
    constructor() {
        this.type = "CHESS";
    }
}
export class ChessWidget extends Widget {
    constructor() {
        super(...arguments);
        this.type = "CHESS";
    }
}
