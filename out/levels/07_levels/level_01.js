import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { Pos, VWIDTH, VHEIGHT, Vec } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initStaticBox, initWinSensor, initLoseSensor, initControl } from "../init_helpers.js";
export class Level01 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 100));
        initWorldBounds();
        initControl('ROLL');
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, VHEIGHT - 125), VWIDTH, 250));
        initStaticBox(PositionedRect.trbl(350, VWIDTH - 150, 350 + 100, 0));
        initStaticBox(PositionedRect.trbl(650, VWIDTH, 650 + 100, 150));
        initStaticBox(PositionedRect.trbl(950, VWIDTH, 950 + 100, 150));
        initStaticBox(PositionedRect.trbl(1250, VWIDTH - 150, 1250 + 100, 0));
        initStaticBox(PositionedRect.trbl(1550, VWIDTH, 1550 + 100, 150));
        const lose = initLoseSensor(PositionedRect.trbl(-VHEIGHT - 200, VWIDTH, -200, 0));
        animationSystem.start(CyclicMoveAnimation.ofOffset(lose, new Vec(0, VHEIGHT + 200), 25));
    }
}
