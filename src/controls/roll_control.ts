import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { Pos, VWIDTH } from "../coords/coords.js";
import { RollMove } from "../events/physics_events.js";
import { PLAYER } from "../payloads/entity_id.js";
import { Control } from "./control.js";

enum Dir {
    NO = 0,
    LEFT = -1,
    RIGHT = 1
}

export class RollControl extends Control implements BusListener {
    private pos?: Pos;
    private dispatchedDir?: Dir;

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

    onEvent(ev: BusEvent): void {
        if (ev.type === 'TICK' && this.pos) {
            // const playerPos = getCenterPosition(PLAYER);
            // const dir = Math.sign(this.pos.x - playerPos.x);
            // if (!this.dispatchedDir) this.dispatchedDir = dir;
            // The user has to let go and press again if they want to change direction.
            // This experience could use some polish...
            // if (this.dispatchedDir === dir)
            //     bus.dispatch(new RollMove(PLAYER, dir));

            if (this.pos.x < VWIDTH / 3) bus.dispatch(new RollMove(PLAYER, Dir.LEFT));
            if (this.pos.x > VWIDTH * 2 / 3) bus.dispatch(new RollMove(PLAYER, Dir.RIGHT));
        }
    }

    onDown(pos: Pos) {
        this.pos = pos;
    }

    onMove(pos: Pos) {
        this.pos = pos;
    }

    onUp(pos: Pos) {
        this.pos = undefined;
        this.dispatchedDir = undefined;
    }

    onCancel() {
        this.pos = undefined;
        this.dispatchedDir = undefined;
    }
}