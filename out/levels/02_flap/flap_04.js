import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { Win } from "../../events/win_loss_events.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initLoseSensor } from "../init_helpers.js";
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
export class Flapping04 {
    constructor() {
        this.anims = [];
        this.tickCount = 0;
    }
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['FLAPPY'], 'FLAPPY');
        this.textEntity = makeEntity({
            initialPos: textPos.center,
            label: 'helpinfo',
            rendering: makeCountdownRendering(20)
        });
        this.lastSetTime = 20;
        initLoseSensor(PositionedRect.trbl(200, VWIDTH, 400, 0));
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 400, VWIDTH, VHEIGHT - 200, 0));
        initLoseSensor(PositionedRect.trbl(400, 200, VHEIGHT - 400, 0));
        initLoseSensor(PositionedRect.trbl(400, VWIDTH, VHEIGHT - 400, VWIDTH - 200));
        this.makeMovingBlock(250, 250, 1750, 1750, 8);
        this.makeMovingBlock(250, 1250, 1750, 250, 4);
        this.makeMovingBlock(250, 2500, VWIDTH - 250, 2500, 4);
        this.makeMovingBlock(VWIDTH, 2200, 0, 2500, 3);
        this.makeMovingBlock(250, VHEIGHT / 2, 1750, VHEIGHT / 2, 8);
        this.makeMovingBlock(250, VHEIGHT / 2, 1750, VHEIGHT / 2, 2);
        this.makeMovingBlock(VWIDTH - 250, VHEIGHT - 250, VWIDTH - 1750, VHEIGHT - 1750, 8);
        bus.addListener(this);
    }
    deactivate() {
        this.anims = [];
        bus.removeListener(this);
    }
    makeMovingBlock(fromX, fromY, toX, toY, durationS) {
        const id = initStaticBox(new PositionedRect(new Pos(fromX, fromY), 250, 250));
        this.anims.push(CyclicMoveAnimation.to(id, new Pos(toX, toY), durationS));
    }
    onEvent(ev) {
        if (ev.type !== 'TICK')
            return;
        const timeLeft = 20 - Math.round(this.tickCount / 60);
        if (timeLeft !== this.lastSetTime && this.textEntity) {
            bus.dispatch(new SetPayloadEvent(this.textEntity, {
                type: 'RENDERING',
                payload: makeCountdownRendering(timeLeft)
            }));
            this.lastSetTime = timeLeft;
        }
        if (this.tickCount === 60 * 20)
            bus.dispatch(new Win());
        this.tickCount++;
        for (let anim of this.anims) {
            anim.tick();
        }
    }
}
