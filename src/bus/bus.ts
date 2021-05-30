// The Bus is a single global point where everything flows through.
// At least for now, all possible event types are centrally defined here.

import { ApplyForce, ChangePhysicsEntityCategory, RollMove, SetGravity, SetVelocity } from "../events/physics_events.js";
import { CreateEntity, DestroyEntity } from "../events/core_entity_events.js";
import { Draw } from "../events/draw.js";
import { Tick } from "../events/tick_event.js";
import { ClearPayloadEvent, SetPayloadEvent } from "../events/payload_events.js";
import { ActivateControl } from "../events/activate_control_events.js";
import { Lose, Win } from "../events/win_loss_events.js";
import { LevelChanged } from "../events/reset_all_systems_event.js";
import { ScreenFullyShown } from "../events/screen_fully_shown_event.js";
import { DisablePhysicsMouse, EnablePhysicsMouse } from "../events/physics_mouse_events.js";
import { ViewportChanged } from "../events/viewport_size_change_event.js";

// Core idea is that we should be able to record + replay events for
// deterministic behavior.

export type BusEvent =
    SetVelocity |
    RollMove |
    ApplyForce |
    SetGravity |
    Tick |
    Draw |
    CreateEntity |
    DestroyEntity |
    SetPayloadEvent |
    ClearPayloadEvent |
    ActivateControl |
    Win |
    Lose |
    LevelChanged |
    ScreenFullyShown |
    ChangePhysicsEntityCategory |
    EnablePhysicsMouse |
    DisablePhysicsMouse |
    ViewportChanged;

export interface BusListener {
    onEvent(ev: BusEvent): void;
}

export class Bus {
    // Listeners are an _ordered_ list (both ticks and draws might be heavily
    // ordered dependent).
    private readonly listeners: BusListener[] = [];
    private constructor() { }
    static singleton = new Bus();

    logSpammyEvents = false
    logNonSpammyEvents = false

    dispatch(ev: BusEvent, consideredSpammyForLog: boolean = false) {
        if ((this.logSpammyEvents && consideredSpammyForLog) ||
            (this.logNonSpammyEvents && !consideredSpammyForLog)) {
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
                if (ls[i] == l) {
                    ls.splice(i, 1);
                    return;
                }
            }
        }
    }
}

const bus = Bus.singleton;
export { bus };