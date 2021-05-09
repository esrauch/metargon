import { InputHandler } from "../input/input.js";
import { ChangeControlWidget, ChangeControlWidgetSpecificData } from "./change_control_widget.js";
import { ChessWidget, ChessWidgetSpecificData } from "./chess_widget.js";

export interface WidgetSpecificData { readonly type: string; }
export class Widget extends InputHandler {}

export type SomeWidget =
    ChessWidget |
    ChangeControlWidget;

export type SomeWidgetSpecificData =
    ChessWidgetSpecificData |
    ChangeControlWidgetSpecificData;

export type WidgetType = (SomeWidget["type"] & SomeWidgetSpecificData["type"]);