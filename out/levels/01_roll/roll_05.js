import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT, Vec } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initWinSensor, initStaticBox, initLoseSensor } from "../init_helpers.js";
const level = 'TIME IT';
export class Rolling05 {
    constructor() {
        this.moveAnimations = [];
    }
    activate() {
        bus.addListener(this);
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds();
        initControlsWidget(['ROLL'], 'ROLL');
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, VHEIGHT - 125), VWIDTH, 250));
        {
            initStaticBox(PositionedRect.trbl(350, VWIDTH - 150, 350 + 100, 0), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(350, VWIDTH, 350 + 100, VWIDTH - 150));
            this.moveAnimations.push(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-300, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(650, VWIDTH, 650 + 100, 150), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(650, 150, 650 + 100, 0));
            this.moveAnimations.push(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(200, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(950, VWIDTH, 950 + 100, 150), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(950, 350, 950 + 100, 350 - 150));
            this.moveAnimations.push(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-200, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(1250, VWIDTH - 150, 1250 + 100, 0), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(1250, VWIDTH, 1250 + 100, VWIDTH - 150));
            this.moveAnimations.push(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-80, 0), 10));
        }
        {
            initStaticBox(PositionedRect.trbl(1550, VWIDTH, 1550 + 100, 150), level);
            const loseSensor1 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            this.moveAnimations.push(CyclicMoveAnimation.ofOffset(loseSensor1, new Vec(-300, 0), 2));
            const loseSensor2 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            this.moveAnimations.push(CyclicMoveAnimation.ofOffset(loseSensor2, new Vec(-150, 0), 2.7));
            const loseSensor3 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            this.moveAnimations.push(CyclicMoveAnimation.ofOffset(loseSensor3, new Vec(-500, 0), 3.8));
        }
    }
    deactivate() {
        bus.removeListener(this);
    }
    onEvent(ev) {
        if (ev.type !== 'TICK')
            return;
        for (const anim of this.moveAnimations) {
            anim.tick();
        }
    }
}
