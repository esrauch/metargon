import { bus, BusEvent, BusListener } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { ClearPayloadEvent, SetPayloadEvent } from "../../events/payload_events.js";
import { Id } from "../../payloads/entity_id.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initResetButton, initWinSensor, initLoseSensor } from "../init_helpers.js";
import { Level } from "../level.js";

const releaseTime = 5;
const textPos = PositionedRect.trbl(
    500,
    VWIDTH,
    600,
    0,
);

export class Shot04 implements Level, BusListener {
    private textEntity?: Id;
    private lastSetSeconds?: number;
    private ticksRemaining = releaseTime * 60;

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

        const winBox = PositionedRect.trbl(
            VHEIGHT- 250, VWIDTH/2, VHEIGHT, VWIDTH/2 - 250);
        initWinSensor(winBox);
        
        initLoseSensor(PositionedRect.trbl(
            winBox.t, winBox.l, winBox.b, 0));
        initLoseSensor(PositionedRect.trbl(
            winBox.t, VWIDTH, winBox.b, winBox.r));

        bus.addListener(this);
    }
    deactivate() {
        this.lastSetSeconds = undefined;
        bus.removeListener(this);
    }

    onEvent(ev: BusEvent): void {
        if (ev.type !== 'TICK' || !this.textEntity) return;

        this.updateCountdownRendering();
        if (this.ticksRemaining == 0) {
            bus.dispatch(new DestroyEntity(this.textEntity!));
            this.textEntity = undefined;
        }
        this.ticksRemaining--;
    }

    private updateCountdownRendering() {
        const s = Math.round(this.ticksRemaining/60);
        if (this.lastSetSeconds == s || !this.textEntity) return;
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