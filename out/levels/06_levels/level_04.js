import { DelayedCallback } from "../../anim/delayed_callback.js";
import { UpdateRenderingAnim } from "../../anim/update_rendering_anim.js";
import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initLoseSensor, initStaticBox, initControls } from "../init_helpers.js";
const releaseTime = 5;
const textPos = PositionedRect.trbl(500, VWIDTH, 600, 0);
function updateCountdownRendering(tickCount) {
    const s = releaseTime - Math.round(tickCount / 60);
    return {
        type: 'BOXED_TEXT',
        boxW: textPos.w,
        boxH: textPos.h,
        text: `OH NO... ${s}`,
        fontSize: 75,
    };
}
export class Level04 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, 250));
        initWorldBounds(/* showWorldBounds */ false, /* skipblockontop */ true);
        initControls('SHOT');
        initStaticBox(PositionedRect.trbl(0, 1300, VHEIGHT, 1200));
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
        animationSystem.addAnimation(new UpdateRenderingAnim(textEntity, updateCountdownRendering, 60));
        animationSystem.addAnimation(new DelayedCallback(() => { bus.dispatch(new DestroyEntity(textEntity)); }, releaseTime * 60));
        const targetRect = new PositionedRect(new Pos(VWIDTH - 750 / 2, VHEIGHT / 4), 750, 100);
        this.shotTarget = makeEntity({
            label: 'shot_target',
            initialPos: targetRect.center,
            rendering: {
                type: 'BOXED_TEXT',
                boxW: targetRect.w,
                boxH: targetRect.h,
                fontSize: 50,
                text: 'SHOOT ME',
                color: Color.GRASS,
            }
        });
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 250, VWIDTH, VHEIGHT, 0));
        bus.addListener(this);
    }
    deactivate() {
        bus.removeListener(this);
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                this.onCreateEntity(ev);
                break;
        }
    }
    onCreateEntity(ev) {
        if (ev.corePayload.payload.label === 'shot') {
            bus.dispatch(new SetPayloadEvent(ev.entityId, {
                type: 'SENSOR',
                payload: {
                    target: this.shotTarget,
                    rect: { w: 750, h: 100 },
                    callback: () => bus.dispatch(new Win())
                }
            }));
        }
    }
}
