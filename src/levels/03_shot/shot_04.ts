
import { DelayedDestroy } from "../../anim/delayed_callback.js";
import { UpdateRenderingAnim } from "../../anim/update_rendering_anim.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { RenderingPayload } from "../../payloads/rendering_payload.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initWinSensor, initLoseSensor, initControl } from "../init_helpers.js";
import { Level } from "../level.js";

const releaseTime = 5;
const textPos = PositionedRect.trbl(
    500,
    VWIDTH,
    600,
    0,
);

function updateCountdownRendering(tickCount: number): RenderingPayload {
    const s = releaseTime - Math.round(tickCount / 60);
    return {
        type: 'BOXED_TEXT',
        boxW: textPos.w,
        boxH: textPos.h,
        text: `OH NO... ${s}`,
        fontSize: 75,
    };
}

export class Shot04 implements Level {

    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 250));
        initWorldBounds(/* showWorldBounds */ false);
        initControl('SHOT');

        const textEntity = makeEntity({
            label: 'holderupper',
            initialPos: textPos.center,
            physics: {
                hull: {
                    type: 'RECT',
                    width: textPos.w,
                    height: textPos.h,
                },
                isStatic: true,
            }
        });
        animationSystem.start(new UpdateRenderingAnim(textEntity, updateCountdownRendering, 60));
        animationSystem.start(new DelayedDestroy(textEntity, releaseTime * 60));

        const winBox = PositionedRect.trbl(
            VHEIGHT- 250, VWIDTH/2, VHEIGHT, VWIDTH/2 - 250);
        initWinSensor(winBox);
        initLoseSensor(PositionedRect.trbl(
            winBox.t, winBox.l, winBox.b, 0));
        initLoseSensor(PositionedRect.trbl(
            winBox.t, VWIDTH, winBox.b, winBox.r));
    }
}