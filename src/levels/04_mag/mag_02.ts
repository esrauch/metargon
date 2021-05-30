import { pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Color } from "../../gfx/gfx.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initControlsWidget, initPlayerEntity, initResetButton, initWinSensor, initWorldBounds, makeWorldBoundsEntity } from "../init_helpers.js";
import { Level } from "../level.js";


export class Mag02 implements Level {
    activate() {
        initPlayerEntity(pos(VWIDTH / 2, VHEIGHT));
        initWorldBounds();
        initControlsWidget(['MAG'], 'MAG');
        initResetButton();

        const ballId = makeEntity({
            initialPos: pos(VWIDTH/3, VHEIGHT-150),
            label: 'ball',
            physics: {
                hull: {
                    type: 'RECT',
                    width: 300,
                    height: 200,
                },
                entityCategory: PhysicsEntityCategory.MAGNETIC
            },
            rendering: {
                type: 'PHYSICS_HULL',
                color: Color.WATER,
            }
        });

        makeEntity({
            initialPos: pos(750, VHEIGHT-600),
            label: 'rope',
            rendering: {
                type: 'CONNECTOR',
                otherEntity: ballId
            }
        }, {
            type: 'PHYSICS_CONSTRAINT',
            payload: {
                entity: ballId,
            }
        });

        initWinSensor(PositionedRect.trbl(VHEIGHT-250,VWIDTH,VHEIGHT,VWIDTH-250));
    }
}