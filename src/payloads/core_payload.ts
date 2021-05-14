
// "Core" Properties that all Entities have.

import { TypedPayload } from "./payload.js";

export class CorePayload {
    constructor(
        readonly label: string,
        ) {}
}

export interface CoreTypedPayload extends TypedPayload<CorePayload> {
    readonly type: 'CORE';
}
