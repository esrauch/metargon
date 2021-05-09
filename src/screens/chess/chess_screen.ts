import { bus } from "../../bus/bus.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { Id } from "../../payloads/entity_id.js";
import { makeWorldBoundsEntity } from "../../util/world_bounds_entity.js";
import { ActiveScreen } from "../screen.js";
import { ChessRenderable } from "../../systems/chess/chess_renderable.js";


export class ChessScreen implements ActiveScreen {
    readonly entities: Id[] = [];
    readonly chessRenderable = new ChessRenderable();
    constructor() {}

    activate() {
        this.entities.push(makeWorldBoundsEntity());
        this.entities.push(
            makeEntity({
                label: "Board",
                rendering: {
                    type: 'CUSTOM',
                    obj: this.chessRenderable,
                }
            }));
    }

    fullyShown() {
    }

    deactivate() {
        for (const e of this.entities)
            bus.dispatch(new DestroyEntity(e));
    }


}