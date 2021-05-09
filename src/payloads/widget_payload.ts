import { WidgetSpecificData, WidgetType } from "../widgets/widgets.js";
import { TypedPayload } from "./payload.js";

export interface WidgetPayload {
    readonly w: number;
    readonly h: number;
    readonly widgetSpecificData: WidgetSpecificData;
}

export interface WidgetTypedPayload extends TypedPayload<WidgetPayload> {
    readonly type: "WIDGET";
}