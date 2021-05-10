import { bus } from "../../bus/bus.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { makeWorldBoundsEntity } from "../../util/world_bounds_entity.js";
import { ChessRenderable } from "../../systems/chess/chess_renderable.js";
import { Pos, VHEIGHT, VWIDTH } from "../../coords/coords.js";
import { ChessPayload } from "../../payloads/chess_payload.js";
export class ChessScreen {
    constructor() {
        this.entities = [];
        this.chessRenderable = new ChessRenderable();
    }
    activate() {
        this.entities.push(makeWorldBoundsEntity());
        this.entities.push(makeEntity({
            label: "Board",
            initialPos: new Pos(VWIDTH / 2, VHEIGHT / 2),
            rendering: {
                type: 'CUSTOM',
                obj: this.chessRenderable,
            }
        }, {
            type: 'CHESS',
            payload: new ChessPayload(5, 5)
        }));
    }
    fullyShown() {
    }
    deactivate() {
        for (const e of this.entities)
            bus.dispatch(new DestroyEntity(e));
    }
}
