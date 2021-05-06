import { Id } from "../../entity/entity_id.js";


export class DestroyEntityEvent {
    readonly type = 'DESTROY_ENTITY';

    constructor(
        readonly entityId: Id
    ) { }
}