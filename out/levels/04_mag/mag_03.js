import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Color } from "../../gfx/gfx.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor, initResetButton, initNonRotatingBox, initLoseSensor } from "../init_helpers.js";
export class Mag03 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT / 2));
        initWorldBounds();
        initControlsWidget(['MAG', 'ROLL'], 'MAG');
        initResetButton();
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH, VHEIGHT / 2 + 750, VWIDTH * 2 / 3));
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH / 3, VHEIGHT / 2 + 750, 0));
        initWinSensor(new PositionedRect(new Pos(VWIDTH * 3 / 4, VHEIGHT / 2 - 125), 250, 250));
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 125, VWIDTH, VHEIGHT, 0));
        const b = initNonRotatingBox(new PositionedRect(new Pos(100, VHEIGHT / 4), 125, 125), Color.WATER);
        bus.dispatch(new ChangePhysicsEntityCategory(b, PhysicsEntityCategory.MAGNETIC));
    }
    deactivate() { }
}
