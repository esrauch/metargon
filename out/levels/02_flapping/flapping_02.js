import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { Win } from "../../events/win_loss_events.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initResetButton, initLoseSensor } from "../init_helpers.js";
export class Flapping02 {
    constructor() {
        this.tickCount = 0;
    }
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['FLAPPY'], 'FLAPPY');
        initResetButton();
        initStaticBox(PositionedRect.fromBounds(VHEIGHT - 200, VWIDTH, VHEIGHT, 0), 'FLAP FOR 10');
        initLoseSensor(PositionedRect.fromBounds(200, VWIDTH, 400, 0));
        initLoseSensor(PositionedRect.fromBounds(VHEIGHT - 400, VWIDTH, VHEIGHT - 200, 0));
        initLoseSensor(PositionedRect.fromBounds(400, 200, VHEIGHT - 400, 0));
        initLoseSensor(PositionedRect.fromBounds(400, VWIDTH, VHEIGHT - 400, VWIDTH - 200));
        bus.addListener(this);
    }
    deactivate() {
        bus.removeListener(this);
    }
    onEvent(ev) {
        if (ev.type !== 'TICK')
            return;
        if (this.tickCount === 60 * 10)
            bus.dispatch(new Win());
        this.tickCount++;
    }
}
