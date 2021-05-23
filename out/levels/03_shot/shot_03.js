import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initLoseSensor } from "../init_helpers.js";
const releaseTime = 5;
const textPos = PositionedRect.trbl(500, VWIDTH, 600, 0);
export class Shot03 {
    constructor() {
        this.ticksRemaining = releaseTime * 60;
    }
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, 250));
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['SHOT'], 'SHOT');
        this.textEntity = makeEntity({
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
        this.ticksRemaining = releaseTime * 60;
        this.updateCountdownRendering();
        const targetRect = new PositionedRect(new Pos(VWIDTH - 750 / 2, VHEIGHT / 2), 750, 750);
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
        this.lastSetSeconds = undefined;
        bus.removeListener(this);
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'TICK':
                this.onTick();
                break;
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
                    rect: { w: 750, h: 750 },
                    callback: () => bus.dispatch(new Win())
                }
            }));
        }
    }
    onTick() {
        if (!this.textEntity)
            return;
        this.updateCountdownRendering();
        if (this.ticksRemaining == 0) {
            bus.dispatch(new DestroyEntity(this.textEntity));
            this.textEntity = undefined;
        }
        this.ticksRemaining--;
    }
    updateCountdownRendering() {
        const s = Math.round(this.ticksRemaining / 60);
        if (this.lastSetSeconds == s || !this.textEntity)
            return;
        this.lastSetSeconds = s;
        bus.dispatch(new SetPayloadEvent(this.textEntity, {
            type: 'RENDERING',
            payload: {
                type: 'BOXED_TEXT',
                boxW: textPos.w,
                boxH: textPos.h,
                text: `OH NO... ${s}`,
                fontSize: 75,
            }
        }));
    }
}
