// The Bus is a single global point where everything flows through.
// At least for now, all possible event types are centrally defined here.

import { ApplyForce, EnablePhysics, SetVelocity } from "../events/physics.js";
import { CreateEntity, DestroyEntity, SetPosition } from "../events/core_entity_events.js";
import { Draw } from "../events/draw.js";
import { Tick } from "../events/tick.js";
import { SetRendering } from "../events/rendering.js";

// Core idea is that we should be able to record + replay events for
// deterministic behavior.

export type BusEvent =
    EnablePhysics |
    SetVelocity |
    ApplyForce |
    Tick |
    Draw |
    SetRendering |
    CreateEntity |
    SetPosition |
    DestroyEntity;

export interface BusListener {
    onEvent(ev: BusEvent): void;
}

export class Bus {
    // Listeners are an _ordered_ list (both ticks and draws might be heavily
    // ordered dependent).
    private readonly listeners: BusListener[] = [];
    private constructor() { }
    static singleton = new Bus();

    logAllEventsBesidesTickAndDraw = true
    logTickAndDraw = false

    dispatch(ev: BusEvent) {
        const isTickOrDraw = ev.type == 'TICK' || ev.type == 'DRAW';
        if ((this.logAllEventsBesidesTickAndDraw && !isTickOrDraw) ||
            (this.logTickAndDraw && isTickOrDraw)) {
            console.log(JSON.stringify(ev));
        }
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
        const ls = this.listeners;
        if (!new Set(ls).has(l)) {
            console.error('tried to double add a listener to bus');
        } else {
            for (let i = 0; i < this.listeners.length; ++i) {
                if (ls[i] == l) ls.splice(i, 1);
            }
        }
    }
}

const bus = Bus.singleton;
export { bus };