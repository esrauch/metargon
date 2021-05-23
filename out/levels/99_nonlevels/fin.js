import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Color } from "../../gfx/gfx.js";
import { statsSystem } from "../../systems/stats_system.js";
const creditsFont = {
    type: 'TEXT',
    size: 200,
    color: Color.GRASS,
};
export class FinScreen {
    activate() {
        document.fonts.load('10px Monoton').then(() => this.init());
    }
    init() {
        makeEntity({
            label: 'credits1',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 3),
            rendering: Object.assign(Object.assign({}, creditsFont), { text: 'å', size: 600, font: 'Monoton' })
        });
        makeEntity({
            label: 'credits2',
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 2),
            rendering: Object.assign(Object.assign({}, creditsFont), { text: 'WIN' })
        });
        const timeAchieved = Math.round((performance.now() - (statsSystem.startTime || 0)) / 1000);
        makeEntity({
            label: 'credits3',
            initialPos: new Pos(VWIDTH / 2, 2000),
            rendering: Object.assign(Object.assign({}, creditsFont), { text: `${timeAchieved} SECONDS` })
        });
        makeEntity({
            label: 'credits4',
            initialPos: new Pos(VWIDTH / 2, 2200),
            rendering: Object.assign(Object.assign({}, creditsFont), { text: `${statsSystem.lossCount} RESETS` })
        });
        makeEntity({
            label: 'credits5',
            initialPos: new Pos(VWIDTH / 2, 2400),
            rendering: Object.assign(Object.assign({}, creditsFont), { text: `${statsSystem.winCount} LEVELS` })
        });
    }
    deactivate() { }
}
