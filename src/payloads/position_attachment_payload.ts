import { Id } from "./entity_id.js";
import { TypedPayload } from "./payload.js";


// PositionAttachment causes an entity's position to be determined by another.
// If the other entity is a dangling reference this payload is ignored.
// A circular reference will cause an infinite loop. Don't do it man.
export interface PositionAttachmentPayload {
    readonly otherEntity: Id;
}

export interface PositionAttachmentTypedPayload extends TypedPayload<PositionAttachmentPayload> {
    readonly type: 'POSITION_ATTACHMENT';
}