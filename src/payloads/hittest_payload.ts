import { TypedPayload } from "./payload.js";


export class HittestPayload {
    constructor(
        readonly w: number,
        readonly h: number,
        readonly callback: () => void) {}
}

export interface HittestTypedPayload extends TypedPayload<HittestPayload> {
    type: 'HITTEST';
}