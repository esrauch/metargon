import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initStaticBox, initWinSensor, initResetButton, initLoseSensor, initControl } from "../init_helpers.js";
import { Level } from "../level.js";

export class Flapping03 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 300));
        initWorldBounds(/* showWorldBounds */ false);
        initControl('FLAP');

        initStaticBox(PositionedRect.trbl(
            VHEIGHT - 200,
            VWIDTH,
            VHEIGHT,
            0,
        ));

        initLoseSensor(new PositionedRect(new Pos(500, 1250), 250, 250));
        initWinSensor(new PositionedRect(new Pos(500, 1500), 250, 250));
        initLoseSensor(new PositionedRect(new Pos(500, 1750), 250, 250));

        initLoseSensor(new PositionedRect(new Pos(1500, 1500), 250, 750));

        const pusher = initStaticBox(PositionedRect.trbl(1000, 250, 2000, 0));
        
        animationSystem.start(
        CyclicMoveAnimation.to(pusher, new Pos(VWIDTH - 125, VHEIGHT/2), 5));
    }
}