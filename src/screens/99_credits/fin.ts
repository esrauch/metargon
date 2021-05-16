import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Color } from "../../gfx/gfx.js";
import { statsSystem } from "../../systems/stats_system.js";
import { ActiveScreen } from "../screen.js";


export class FinScreen implements ActiveScreen {
    activate() {
        const timeAchieved = Math.round((performance.now() - (statsSystem.startTime||0)) / 100) / 10;
        makeEntity({
            label: 'credits1',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 3),
            rendering: {
                type: 'TEXT',
                text: 'å',
                size: 600,
                font: 'Monoton',
                color: Color.GRASS,
            }
        });
        makeEntity({
            label: 'credits2',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 2),
            rendering: {
                type: 'TEXT',
                text: 'WIN',
                size: 200,
                color: Color.GRASS,
            }
        });
        makeEntity({
            label: 'credits3',
            initialPos: new Pos(VWIDTH / 2, 2000),
            rendering: {
                type: 'TEXT',
                text: `${timeAchieved} SECONDS`,
                size: 200,
                color: Color.GRASS,
            }
        });
        makeEntity({
            label: 'credits4',
            initialPos: new Pos(VWIDTH / 2, 2200),
            rendering: {
                type: 'TEXT',
                text: `${statsSystem.lossCount} RESETS`,
                size: 200,
                color: Color.GRASS,
            }
        });
    }

    deactivate() {}
}