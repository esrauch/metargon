import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { Pos, VWIDTH, VHEIGHT, Vec } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initWinSensor, initStaticBox, initLoseSensor, initControl } from "../init_helpers.js";
const level = { text: 'TIME IT' };
export class Rolling05 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds();
        initControl('ROLL');
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, VHEIGHT - 125), VWIDTH, 250));
        {
            initStaticBox(PositionedRect.trbl(350, VWIDTH - 150, 350 + 100, 0), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(350, VWIDTH, 350 + 100, VWIDTH - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-300, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(650, VWIDTH, 650 + 100, 150), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(650, 150, 650 + 100, 0));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(200, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(950, VWIDTH, 950 + 100, 150), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(950, 350, 950 + 100, 350 - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-200, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(1250, VWIDTH - 150, 1250 + 100, 0), level);
            const loseSensor = initLoseSensor(PositionedRect.trbl(1250, VWIDTH, 1250 + 100, VWIDTH - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-130, 0), 10));
        }
        {
            initStaticBox(PositionedRect.trbl(1550, VWIDTH, 1550 + 100, 150), level);
            const loseSensor1 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor1, new Vec(-300, 0), 2));
            const loseSensor2 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor2, new Vec(-150, 0), 2.7));
            const loseSensor3 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor3, new Vec(-500, 0), 3.8));
        }
    }
}
