import { CyclicMoveAnimation } from "../../anim/cyclic_move.js";
import { DelayedWin } from "../../anim/delayed_callback.js";
import { UpdateRenderingAnim } from "../../anim/update_rendering_anim.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { RenderingPayload } from "../../payloads/rendering_payload.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initLoseSensor, initControl } from "../init_helpers.js";
import { Level } from "../level.js";

const textPos = PositionedRect.trbl(
    VHEIGHT - 200,
    VWIDTH,
    VHEIGHT,
    0,
);

const levelDurationS = 10;

function makeCountdownRendering(tickCount: number): RenderingPayload {
    const timeLeft = levelDurationS - Math.round(tickCount / 60);
    return {
        type: 'BOXED_TEXT',
        boxW: textPos.w,
        boxH: textPos.h,
        text: `FLAP FOR ${timeLeft}`,
        fontSize: 75,
    };
}


export class Flapping04 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2));
        initWorldBounds(/* showWorldBounds */ false);
        initControl('FLAP');

        const textEntity = makeEntity({
            initialPos: textPos.center,
            label: 'helpinfo',
        });
        animationSystem.start(
            new UpdateRenderingAnim(textEntity, makeCountdownRendering, 60)
        );

        initLoseSensor(PositionedRect.trbl(200, VWIDTH, 400, 0));
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 400, VWIDTH, VHEIGHT - 200, 0));
        initLoseSensor(PositionedRect.trbl(400, 200, VHEIGHT - 400, 0));
        initLoseSensor(PositionedRect.trbl(400, VWIDTH, VHEIGHT - 400, VWIDTH - 200));

        this.makeMovingBlock(250, 250, 1750, 1750, 8);
        this.makeMovingBlock(250, 1250, 1750, 250, 4);
        this.makeMovingBlock(250, 2500, VWIDTH-250, 2500, 4);
        this.makeMovingBlock(VWIDTH, 2200, 0, 2500, 3);
        this.makeMovingBlock(250, VHEIGHT/2, 1750, VHEIGHT/2, 8);
        this.makeMovingBlock(250, VHEIGHT/2, 1750, VHEIGHT/2, 2);
        this.makeMovingBlock(VWIDTH-250, VHEIGHT-250, VWIDTH-1750, VHEIGHT-1750, 8);

        animationSystem.start(new DelayedWin(levelDurationS * 60));
    }

    private makeMovingBlock(
        fromX: number, fromY: number, toX: number, toY: number, durationS: number) {
        const id = initStaticBox(
            new PositionedRect(new Pos(fromX, fromY), 250, 250));
        animationSystem.start(CyclicMoveAnimation.to(id, new Pos(toX, toY), durationS));
    }
}