import { Pos } from "../../coords/coords.js";
import { Id, makeEntityId } from "../../entity/entity_id.js";


export class CreateEntity {
    readonly type = 'CREATE_ENTITY';
    readonly entityId: number;

    constructor(
        readonly label: string,
        readonly initialPos: Pos,
        // Note: it's an error to create an id that already exists.
        entityId?: Id
    ) {
        this.entityId = entityId === undefined ? makeEntityId() : entityId;
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