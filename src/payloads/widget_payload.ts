import { WidgetSpecificData, WidgetType } from "../widgets/widgets.js";
import { Payload } from "./payload.js";

export interface WidgetPayloadValue {
    readonly w: number;
    readonly h: number;
    readonly widgetSpecificData: WidgetSpecificData;
}

export interface WidgetPayload extends Payload<WidgetPayloadValue> {
    readonly type: "WIDGET";
}