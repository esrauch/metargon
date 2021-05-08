import { Pos } from "../coords/coords.js";
import { Id, makeEntityId } from "../systems/entity/entity_id.js";


export class CreateEntity {
    readonly type = 'CREATE_ENTITY';
    readonly entityId: number;
    readonly initialPos: Pos;

    constructor(
        readonly label: string,
        initialPos?: Pos,
        // Note: it's an error to create an id that already exists.
        entityId?: Id
    ) {
        this.entityId = entityId === undefined ? makeEntityId() : entityId;
        this.initialPos = initialPos === undefined ? new Pos(0, 0) : initialPos;
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