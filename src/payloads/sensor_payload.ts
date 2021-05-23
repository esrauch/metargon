// A Payload for something that triggers if an entity goes into our outside of the
// relevant box.
import { Rect } from "../coords/rect.js";
import { Id } from "./entity_id.js";
import { TypedPayload } from "./payload.js";

export interface SensorPayload {
    readonly rect: Rect;
    readonly target: Id | undefined;
    readonly callback: (hitEntity: Id) => void;

    // If true, triggers if the entity is _outside_ of the box instead of when its inside the box.
    readonly triggerOnOutside?: boolean;

    // Allow the sensor to trip any number of times.
    readonly triggerMultipleTimes ?: boolean;

    // Whether it should activate even before the level has faded in.
    // This shouldn't normally be done for win/loss sensors.
    readonly instantActivate ?: boolean;
}

export interface SensorTypedPayload extends TypedPayload<SensorPayload> {
    type: 'SENSOR';
}