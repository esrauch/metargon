
// "Core" Properties that we essentially all Entities have.

import { Pos } from "../coords/coords.js";
import { Payload } from "./payload.js";

export class CorePayloadValue {
    constructor(
        readonly label: string,
        readonly pos: Pos
        ) {}
}

export interface CorePayload extends Payload<CorePayloadValue> {
    readonly type: 'CORE';
}
