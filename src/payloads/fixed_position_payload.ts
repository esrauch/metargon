import { Pos } from "../coords/coords.js";
import { TypedPayload } from "./payload.js";


export class PositionPayload extends Pos {}

export interface PositionTypedPayload extends TypedPayload<PositionPayload> {
    type: 'POSITION';
}