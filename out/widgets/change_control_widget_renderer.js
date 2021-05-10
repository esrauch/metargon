export class ChangeControlWidgetRenderer {
    constructor() {
        this.type = "CHANGE_CONTROL";
    }
    draw(gfx, pos, payload) {
        gfx.strokerect(pos, payload.w, payload.h, '#f00');
    }
}
