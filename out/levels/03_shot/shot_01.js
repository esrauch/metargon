import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget } from "../init_helpers.js";
export class Shot01 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT - 250));
        initWorldBounds();
        initControlsWidget(['SHOT'], 'SHOT');
        this.shotTarget = makeEntity({
            label: 'shot_target',
            initialPos: new Pos(VWIDTH - 750 / 2, VHEIGHT / 4),
            rendering: {
                type: 'BOXED_TEXT',
                boxW: 750,
                boxH: 750,
                fontSize: 50,
                text: 'SHOOT ME',
                color: Color.GRASS,
            }
        });
        bus.addListener(this);
    }
    deactivate() {
        this.shotTarget = undefined;
        bus.removeListener(this);
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'CREATE_ENTITY':
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
    }
}
