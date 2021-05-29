import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { Pos, VWIDTH, VHEIGHT, Vec } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initLoseSensor, initStaticBox, initWinSensor, initControl } from "../init_helpers.js";
export class Tilt02 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds();
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, VHEIGHT - 125), VWIDTH, 250));
        {
            initStaticBox(PositionedRect.trbl(350, VWIDTH - 150, 350 + 100, 0));
            const loseSensor = initLoseSensor(PositionedRect.trbl(350, VWIDTH, 350 + 100, VWIDTH - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-300, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(650, VWIDTH, 650 + 100, 150));
            const loseSensor = initLoseSensor(PositionedRect.trbl(650, 150, 650 + 100, 0));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(200, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(950, VWIDTH, 950 + 100, 150));
            const loseSensor = initLoseSensor(PositionedRect.trbl(950, 350, 950 + 100, 350 - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-200, 0), 4));
        }
        {
            initStaticBox(PositionedRect.trbl(1250, VWIDTH - 150, 1250 + 100, 0));
            const loseSensor = initLoseSensor(PositionedRect.trbl(1250, VWIDTH, 1250 + 100, VWIDTH - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor, new Vec(-130, 0), 10));
        }
        {
            initStaticBox(PositionedRect.trbl(1550, VWIDTH, 1550 + 100, 150));
            const loseSensor1 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor1, new Vec(-300, 0), 2));
            const loseSensor2 = initLoseSensor(PositionedRect.trbl(1550, 350, 1550 + 100, 350 - 150));
            animationSystem.start(CyclicMoveAnimation.ofOffset(loseSensor2, new Vec(-150, 0), 2.7));
        }
        initControl('TILT');
    }
}
