import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Color } from "../../gfx/gfx.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton, initNonRotatingBox } from "../init_helpers.js";
export class Mag02 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2));
        initWorldBounds();
        initControlsWidget(['MAG'], 'MAG');
        initResetButton();
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH, VHEIGHT / 2 + 750, VWIDTH * 2 / 3));
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH / 3, VHEIGHT / 2 + 750, 0));
        const winRect = new PositionedRect(new Pos(VWIDTH / 2, 500), 250, 250);
        const winSensor = initWinSensor(winRect);
        bus.dispatch(new SetPayloadEvent(winSensor, {
            type: 'PHYSICS',
            payload: {
                hull: {
                    type: 'RECT',
                    width: winRect.w,
                    height: winRect.h,
                },
                entityCategory: PhysicsEntityCategory.NO_COLLIDE_WITH_PLAYER,
                nonRotating: true,
            }
        }));
        const b = initNonRotatingBox(PositionedRect.trbl(winRect.b, VWIDTH * 2 / 3 + 50, winRect.b + 100, VWIDTH / 3 - 50), Color.WATER);
        bus.dispatch(new ChangePhysicsEntityCategory(b, PhysicsEntityCategory.MAGNETIC));
    }
}
