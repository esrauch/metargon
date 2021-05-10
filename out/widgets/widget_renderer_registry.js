import { ChangeControlWidgetRenderer } from "./change_control_widget_renderer.js";
const cache = new Map();
function isWidgetRendererType(r, type) {
    return r.type === type;
}
function makeWidgetRenderer(type) {
    switch (type) {
        case 'CHANGE_CONTROL':
            return new ChangeControlWidgetRenderer();
    }
    throw Error('No widget renderer for type' + type);
}
export function getWidgetRenderer(type) {
    let cached = cache.get(type);
    if (!cached) {
        cached = makeWidgetRenderer(type);
        cache.set(type, cached);
    }
    if (!isWidgetRendererType(cached, type))
        throw Error('Wrong type in cache');
    return cached;
}
