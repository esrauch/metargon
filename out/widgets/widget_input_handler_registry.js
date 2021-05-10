import { ChangeControlWidgetInputHandler } from "./change_control_widget_input_handler.js";
const cache = new Map();
function isWidgetInputHandlerType(r, type) {
    return r.type === type;
}
function makeWidgetInputHandler(type) {
    switch (type) {
        case 'CHANGE_CONTROL':
            return new ChangeControlWidgetInputHandler();
    }
    throw Error('No widget renderer for type' + type);
}
export function getWidgetInputHandler(type) {
    let cached = cache.get(type);
    if (!cached) {
        cached = makeWidgetInputHandler(type);
        cache.set(type, cached);
    }
    if (!isWidgetInputHandlerType(cached, type))
        throw Error('Wrong type in cache');
    return cached;
}
