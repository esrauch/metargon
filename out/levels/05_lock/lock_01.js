import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Color } from "../../gfx/gfx.js";
import { PLAYER } from "../../payloads/entity_id.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initControlsWidget, initStaticBox, initWinSensor } from "../init_helpers.js";
export class Lock01 {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, VHEIGHT / 2), Color.WATER);
        initWorldBounds(/* showWorldBounds */ false);
        initControlsWidget(['LOCK', 'FLAP'], 'LOCK');
        initStaticBox(PositionedRect.trbl(VHEIGHT / 2, VWIDTH, VHEIGHT / 2 + 750, 0), 'LOCK = FREEZE BLUE');
        bus.dispatch(new ChangePhysicsEntityCategory(PLAYER, PhysicsEntityCategory.MAGNETIC));
        initWinSensor(new PositionedRect(new Pos(VWIDTH / 2, 500), 250, 250));
    }
    deactivate() { }
}
