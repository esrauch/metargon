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
    private dir = Dir.NO;

    enable() {
        this.dir = Dir.NO;
        bus.addListener(this);
    }

    disable() {
        this.dir = Dir.NO;
        bus.removeListener(this);
    }

    onEvent(ev: BusEvent): void {
        if (ev.type === 'TICK' && this.dir != Dir.NO)
            bus.dispatch(new RollMove(PLAYER, this.dir));
    }

    updateDir(pos: Pos) {
        if (pos.x > VWIDTH * 2/3) this.dir = Dir.RIGHT;
        else if (pos.x < VWIDTH * 1/3) this.dir = Dir.LEFT;
        else this.dir = Dir.NO;
    }

    onDown(pos: Pos) {
        this.updateDir(pos);
    }

    onMove(pos: Pos) {
        this.updateDir(pos);
    }

    onUp(pos: Pos) {
        this.dir = Dir.NO;
    }

    onCancel() {
        this.dir = Dir.NO;
    }
}