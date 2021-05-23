import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initLoseSensor } from "../init_helpers.js";
export class Flapping03 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 300));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['FLAP'], 'FLAP');
        initStaticBox(PositionedRect.trbl(VHEIGHT - 200, VWIDTH, VHEIGHT, 0));
        initLoseSensor(new PositionedRect(new Pos(500, 1250), 250, 250));
        initWinSensor(new PositionedRect(new Pos(500, 1500), 250, 250));
        initLoseSensor(new PositionedRect(new Pos(500, 1750), 250, 250));
        initLoseSensor(new PositionedRect(new Pos(1500, 1500), 250, 750));
        const pusher = initStaticBox(PositionedRect.trbl(1000, 250, 2000, 0));
        this.pusherAnim = CyclicMoveAnimation.to(pusher, new Pos(VWIDTH - 125, VHEIGHT / 2), 5);
        bus.addListener(this);
    }
    deactivate() {
        this.pusherAnim = undefined;
        bus.removeListener(this);
    }
    onEvent(ev) {
        var _a;
        if (ev.type === 'TICK')
            (_a = this.pusherAnim) === null || _a === void 0 ? void 0 : _a.tick();
    }
}
