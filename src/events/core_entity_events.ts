import { Pos } from "../coords/coords.js";
import { CoreTypedPayload } from "../payloads/core_payload.js";
import { Id, makeEntityId } from "../payloads/entity_id.js";


export class CreateEntity {
    readonly type = 'CREATE_ENTITY';
    readonly entityId: number;
    readonly corePayload: CoreTypedPayload;

    constructor(
        label: string,
        initialPos?: Pos,
        // Note: it's an error to create an id that already exists.
        entityId?: Id
    ) {
        this.entityId = entityId === undefined ? makeEntityId() : entityId;
        initialPos = initialPos === undefined ? new Pos(0, 0) : initialPos;
        this.corePayload = {
            type: 'CORE',
            payload: {
                label,
                pos: initialPos,
            }
        }
    }
}

export class DestroyEntity {
    readonly type = 'DESTROY_ENTITY';

    constructor(
        readonly entityId: Id
    ) { }
}

export class SetPosition {
    readonly type = 'SET_POSITION';
    constructor(readonly entityId: Id, readonly pos: Pos) { }
}