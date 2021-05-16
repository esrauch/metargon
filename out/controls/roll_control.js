import { bus } from "../bus/bus.js";
import { RollMove } from "../events/physics_events.js";
import { PLAYER } from "../payloads/entity_id.js";
import { getCenterPosition } from "../systems/getters.js";
import { Control } from "./control.js";
var Dir;
(function (Dir) {
    Dir[Dir["NO"] = 0] = "NO";
    Dir[Dir["LEFT"] = -1] = "LEFT";
    Dir[Dir["RIGHT"] = 1] = "RIGHT";
})(Dir || (Dir = {}));
export class RollControl extends Control {
    enable() {
        this.pos = undefined;
        this.dispatchedDir = undefined;
        bus.addListener(this);
    }
    disable() {
        this.pos = undefined;
        this.dispatchedDir = undefined;
        bus.removeListener(this);
    }
    onEvent(ev) {
        if (ev.type === 'TICK' && this.pos) {
            const playerPos = getCenterPosition(PLAYER);
            const dir = Math.sign(this.pos.x - playerPos.x);
            if (!this.dispatchedDir)
                this.dispatchedDir = dir;
            // The user has to let go and press again if they want to change direction.
            // This experience could use some polish...
            if (this.dispatchedDir === dir)
                bus.dispatch(new RollMove(PLAYER, dir));
        }
    }
    onDown(pos) {
        this.pos = pos;
    }
    onMove(pos) {
        this.pos = pos;
    }
    onUp(pos) {
        this.pos = undefined;
        this.dispatchedDir = undefined;
    }
    onCancel() {
        this.pos = undefined;
        this.dispatchedDir = undefined;
    }
}
