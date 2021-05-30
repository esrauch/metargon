import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Color } from "../../gfx/gfx.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initStaticBox, initWinSensor, initResetButton, initNonRotatingBox, initLoseSensor, initControl } from "../init_helpers.js";
export class Level07 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 4, VHEIGHT / 2));
        initWorldBounds();
        initControl('MAG');
        initResetButton();
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH / 3, VHEIGHT / 2 + 750, 0));
        initWinSensor(PositionedRect.trbl(0, VWIDTH, VHEIGHT / 2, VWIDTH * 3 / 4));
        initLoseSensor(PositionedRect.trbl(VHEIGHT / 2 + 500, VWIDTH, VHEIGHT, 0));
        const b = initNonRotatingBox(new PositionedRect(new Pos(175, VHEIGHT / 4), 350, 50), Color.WATER);
        bus.dispatch(new ChangePhysicsEntityCategory(b, PhysicsEntityCategory.MAGNETIC));
    }
}
