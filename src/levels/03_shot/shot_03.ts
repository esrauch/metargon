import { DelayedDestroy } from "../../anim/delayed_callback.js";
import { UpdateRenderingAnim } from "../../anim/update_rendering_anim.js";
import { bus, BusEvent, BusListener } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { CreateEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { Id } from "../../payloads/entity_id.js";
import { RenderingPayload } from "../../payloads/rendering_payload.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initLoseSensor } from "../init_helpers.js";
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

export class Shot03 implements Level, BusListener {
    private shotTarget?: Id;

    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 250));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['SHOT'], 'SHOT');

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

        const targetRect = new PositionedRect(
            new Pos(VWIDTH - 750 / 2, VHEIGHT / 2), 750, 750);
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

        initLoseSensor(PositionedRect.trbl(
            VHEIGHT - 250, VWIDTH, VHEIGHT, 0));

        bus.addListener(this);
    }
    deactivate() {
        bus.removeListener(this);
    }

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'CREATE_ENTITY': this.onCreateEntity(ev); break;
        }
    }

    private onCreateEntity(ev: CreateEntity) {
        if (ev.corePayload.payload.label === 'shot') {
            bus.dispatch(new SetPayloadEvent(ev.entityId, {
                type: 'SENSOR',
                payload: {
                    target: this.shotTarget!,
                    rect: { w: 750, h: 750 },
                    callback: () => bus.dispatch(new Win())
                }
            }));
        }
    }
}