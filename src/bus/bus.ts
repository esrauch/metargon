// The Bus is a single global point where everything flows through.
// At least for now, all possible event types are centrally defined here.

import { ApplyForceEvent } from "./events/apply_force.js";
import { CreateEntityEvent } from "./events/create_entity.js";
import { DestroyEntityEvent } from "./events/destroy_entity.js";
import { DrawEvent } from "./events/draw.js";
import { TickEvent } from "./events/tick.js";

// Core idea is that we should be able to record + replay events for
// deterministic behavior.

export type BusEvent =
        ApplyForceEvent | TickEvent | DrawEvent | CreateEntityEvent | DestroyEntityEvent;

export interface BusListener {
    onEvent(ev: BusEvent): void;
}

export class Bus {
    // Listeners are an _ordered_ list (both ticks and draws might be heavily
    // ordered dependent).
    private readonly listeners: BusListener[] = [];
    private constructor() {}
    static singleton = new Bus();

    dispatch(ev: BusEvent) {
        for (const l of this.listeners) {
            l.onEvent(ev);
        }
    }

    addListener(l: BusListener) {
        if (new Set(this.listeners).has(l)) {
            console.error('tried to double add a listener to bus');
        } else {
            this.listeners.push(l);
        }
    }
    removeListener(l: BusListener) {
        throw Error('Not Implemented');
    }
}

const bus = Bus.singleton;
export {bus};