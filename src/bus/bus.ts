// The Bus is a single global point where everything flows through.
// At least for now, all possible event types are centrally defined here.

import { ApplyForceEvent, EnablePhysics, SetVelocityEvent } from "./events/physics.js";
import { CreateEntityEvent } from "./events/create_entity.js";
import { DestroyEntityEvent } from "./events/destroy_entity.js";
import { DrawEvent } from "./events/draw.js";
import { TickEvent } from "./events/tick.js";
import { EnableRendering } from "./events/rendering.js";

// Core idea is that we should be able to record + replay events for
// deterministic behavior.

export type BusEvent =
    EnablePhysics |
    SetVelocityEvent |
    ApplyForceEvent |
    TickEvent |
    DrawEvent |
    EnableRendering |
    CreateEntityEvent |
    DestroyEntityEvent;

export interface BusListener {
    onEvent(ev: BusEvent): void;
}

export class Bus {
    // Listeners are an _ordered_ list (both ticks and draws might be heavily
    // ordered dependent).
    private readonly listeners: BusListener[] = [];
    private constructor() { }
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

    addListeners(ls: BusListener[]) {
        for (const l of ls) this.addListener(l);
    }

    removeListener(l: BusListener) {
        throw Error('Not Implemented');
    }
}

const bus = Bus.singleton;
export { bus };