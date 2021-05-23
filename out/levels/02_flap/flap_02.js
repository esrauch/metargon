import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { Win } from "../../events/win_loss_events.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initLoseSensor } from "../init_helpers.js";
const textPos = PositionedRect.trbl(VHEIGHT - 200, VWIDTH, VHEIGHT, 0);
function makeCountdownRendering(s) {
    return {
        type: 'BOXED_TEXT',
        boxW: textPos.w,
        boxH: textPos.h,
        text: `FLAP FOR ${s}`,
        fontSize: 75,
    };
}
export class Flapping02 {
    constructor() {
        this.tickCount = 0;
    }
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['FLAP'], 'FLAP');
        this.textEntity = makeEntity({
            initialPos: textPos.center,
            label: 'helpinfo',
            rendering: makeCountdownRendering(10)
        });
        this.lastSetTime = 10;
        initLoseSensor(PositionedRect.trbl(200, VWIDTH, 400, 0));
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 400, VWIDTH, VHEIGHT - 200, 0));
        initLoseSensor(PositionedRect.trbl(400, 200, VHEIGHT - 400, 0));
        initLoseSensor(PositionedRect.trbl(400, VWIDTH, VHEIGHT - 400, VWIDTH - 200));
        bus.addListener(this);
    }
    deactivate() {
        this.textEntity = undefined;
        this.lastSetTime = undefined;
        bus.removeListener(this);
    }
    onEvent(ev) {
        if (ev.type !== 'TICK')
            return;
        const timeLeft = 10 - Math.round(this.tickCount / 60);
        if (timeLeft !== this.lastSetTime && this.textEntity) {
            bus.dispatch(new SetPayloadEvent(this.textEntity, {
                type: 'RENDERING',
                payload: makeCountdownRendering(timeLeft)
            }));
            this.lastSetTime = timeLeft;
        }
        if (this.tickCount === 60 * 10)
            bus.dispatch(new Win());
        this.tickCount++;
    }
}
