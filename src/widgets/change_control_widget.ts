import { Widget, WidgetSpecificData } from "./widgets.js";

export interface ChangeControlWidgetSpecificData extends WidgetSpecificData {
    readonly type: "CHANGE_CONTROL";
}

export class ChangeControlWidget extends Widget {
    readonly type = "CHANGE_CONTROL";
}