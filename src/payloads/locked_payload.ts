import { TypedPayload } from "./payload.js";

export class LockedPayload {
    constructor(
        readonly isLocked: boolean,
        // Something that was static won't become nonstatic on unlock.
        readonly wasStatic: boolean = false,
    ) {}
}

export interface LockedTypedPayload extends TypedPayload<LockedPayload> {
    type: 'LOCKED';
}