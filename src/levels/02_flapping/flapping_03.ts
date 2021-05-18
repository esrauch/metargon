import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { bus, BusEvent, BusListener } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton, initLoseSensor } from "../init_helpers.js";
import { Level } from "../level.js";

export class Flapping03 implements Level, BusListener {
    private pusherAnim ?: CyclicMoveAnimation;
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 300));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['FLAPPY'], 'FLAPPY');
        initResetButton();

        initStaticBox(PositionedRect.trbl(
            VHEIGHT - 200,
            VWIDTH,
            VHEIGHT,
            0,
        ), 'BECOME PUSHED');

        initLoseSensor(new PositionedRect(new Pos(500, 1250), 250, 250));
        initWinSensor(new PositionedRect(new Pos(500, 1500), 250, 250));
        initLoseSensor(new PositionedRect(new Pos(500, 1750), 250, 250));

        initLoseSensor(new PositionedRect(new Pos(1500, 1500), 250, 750));

        const pusher = initStaticBox(PositionedRect.trbl(1000, 250, 2000, 0));
        this.pusherAnim = CyclicMoveAnimation.to(pusher, new Pos(VWIDTH - 125, VHEIGHT/2), 5)

        bus.addListener(this);
    }

    deactivate(){
        this.pusherAnim = undefined;
        bus.removeListener(this);
    }

    onEvent(ev: BusEvent): void {
        if (ev.type === 'TICK') this.pusherAnim?.tick();
    }
}