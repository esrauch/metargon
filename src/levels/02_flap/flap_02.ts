import { DelayedCallback, DelayedWin } from "../../anim/delayed_callback.js";
import { UpdateRenderingAnim } from "../../anim/update_rendering_anim.js";
import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Win } from "../../events/win_loss_events.js";
import { RenderingPayload } from "../../payloads/rendering_payload.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initLoseSensor } from "../init_helpers.js";
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

export class Flapping02 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['FLAP'], 'FLAP');

        const textEntity = makeEntity({
            initialPos: textPos.center,
            label: 'helpinfo',
        });

        animationSystem.addAnimation(
            new UpdateRenderingAnim(textEntity, makeCountdownRendering, 60)
        );

        initLoseSensor(PositionedRect.trbl(200, VWIDTH, 400, 0));
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 400, VWIDTH, VHEIGHT - 200, 0));
        initLoseSensor(PositionedRect.trbl(400, 200, VHEIGHT - 400, 0));
        initLoseSensor(PositionedRect.trbl(400, VWIDTH, VHEIGHT - 400, VWIDTH - 200));

        animationSystem.addAnimation(new DelayedWin(levelDurationS * 60));
    }
}