import { Widget, WidgetSpecificData } from "./widgets.js";

export class ChessWidgetSpecificData implements WidgetSpecificData {
    readonly type = "CHESS";
}

export class ChessWidget extends Widget {
    readonly type = "CHESS";
}