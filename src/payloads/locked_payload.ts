import { TypedPayload } from "./payload.js";


export interface LockedTypedPayload extends TypedPayload<boolean> {
    type: 'LOCKED';
}