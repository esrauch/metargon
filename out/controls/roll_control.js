import { bus } from "../bus/bus.js";
import { VWIDTH } from "../coords/coords.js";
import { RollMove } from "../events/physics_events.js";
import { PLAYER } from "../payloads/entity_id.js";
import { Control } from "./control.js";
var Dir;
(function (Dir) {
    Dir[Dir["NO"] = 0] = "NO";
    Dir[Dir["LEFT"] = -1] = "LEFT";
    Dir[Dir["RIGHT"] = 1] = "RIGHT";
})(Dir || (Dir = {}));
export class RollControl extends Control {
    constructor() {
        super(...arguments);
        this.dir = Dir.NO;
    }
    enable() {
        this.dir = Dir.NO;
        bus.addListener(this);
    }
    disable() {
        this.dir = Dir.NO;
        bus.removeListener(this);
    }
    onEvent(ev) {
        if (ev.type === 'TICK' && this.dir != Dir.NO)
            bus.dispatch(new RollMove(PLAYER, this.dir));
    }
    updateDir(pos) {
        if (pos.x > VWIDTH * 2 / 3)
            this.dir = Dir.RIGHT;
        else if (pos.x < VWIDTH * 1 / 3)
            this.dir = Dir.LEFT;
        else
            this.dir = Dir.NO;
    }
    onDown(pos) {
        this.updateDir(pos);
    }
    onMove(pos) {
        this.updateDir(pos);
    }
    onUp(pos) {
        this.dir = Dir.NO;
    }
    onCancel() {
        this.dir = Dir.NO;
    }
}
