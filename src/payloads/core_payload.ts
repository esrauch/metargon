
// "Core" Properties that we essentially all Entities have.

import { Pos } from "../coords/coords.js";
import { TypedPayload } from "./payload.js";

export class CorePayload {
    constructor(
        readonly label: string,
        readonly pos: Pos
        ) {}
}

export interface CoreTypedPayload extends TypedPayload<CorePayload> {
    readonly type: 'CORE';
}
