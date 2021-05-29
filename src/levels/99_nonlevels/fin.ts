import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Color } from "../../gfx/gfx.js";
import { RenderingPayload } from "../../payloads/rendering_payload.js";
import { statsSystem } from "../../systems/stats_system.js";
import { logAnalyticsEvent } from "../../util/analytics.js";
import { Level } from "../level.js";

const creditsFont = {
    type: 'TEXT' as 'TEXT',
    size: 200,
    color: Color.GRASS,   
};

export class FinScreen implements Level {
    activate() {
        (document as any).fonts.load('10px Monoton').then(() => this.init());
    }

    private init() {
        makeEntity({
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 3),
            rendering: {
                ...creditsFont,
                text: 'å',
                size: 600,
                font: 'Monoton',
            }
        });
        makeEntity({
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 2),
            rendering: {
                ...creditsFont,
                text: 'WIN',
            }
        });

        const s = Math.round((performance.now() - (statsSystem.startTime||0)) / 1000);

        makeEntity({
            initialPos: new Pos(VWIDTH / 2, 2000),
            rendering: {
                ...creditsFont,
                text: `${statsSystem.formattedTimeSinceStart} TIME`,
            }
        });
        makeEntity({
            initialPos: new Pos(VWIDTH / 2, 2200),
            rendering: {
                ...creditsFont,
                text: `${statsSystem.lossCount} DEATHS`,
            }
        });
        makeEntity({
            initialPos: new Pos(VWIDTH / 2, 2400),
            rendering: {
                ...creditsFont,
                text: `${statsSystem.winCount} LEVELS`,
            }
        });

        logAnalyticsEvent('fin_screen_shown');
    }

    deactivate() {}
}