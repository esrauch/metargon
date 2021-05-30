import { bus } from "../bus/bus.js";
import { delta } from "../coords/coords.js";
import { DestroyEntity } from "../events/core_entity_events.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { SetVelocity } from "../events/physics_events.js";
import { PhysicsEntityCategory } from "../payloads/physics_payload.js";
import { getCenterPosition } from "../systems/getters.js";
import { physics } from "../systems/physics/physics.js";
import { Control } from "./control.js";
// See the Physics system for Magnet impl.
export class MagnetControl extends Control {
    reset() {
        if (this.indicator)
            bus.dispatch(new DestroyEntity(this.indicator));
        this.indicator = undefined;
        this.selected = undefined;
    }
    enable() {
        this.reset();
        bus.addListener(this);
    }
    disable() {
        this.reset();
        bus.removeListener(this);
    }
    onEvent(ev) {
        if (ev.type !== 'TICK')
            return;
        if (!this.selected || !this.indicator)
            return;
        const selectedPos = getCenterPosition(this.selected);
        const indicatorPos = getCenterPosition(this.indicator);
        const v = delta(indicatorPos, selectedPos).normalizeIfLongerThan(200);
        bus.dispatch(new SetVelocity(this.selected, v), /* spammy */ false);
    }
    onDown(pos) {
        this.reset();
        this.selected = physics.query(pos, {
            entityType: PhysicsEntityCategory.MAGNETIC,
            includeStatic: false,
        });
        if (this.selected) {
            this.indicator = makeEntity({
                initialPos: pos,
                rendering: {
                    type: 'CONNECTOR',
                    otherEntity: this.selected
                }
            });
        }
    }
    onMove(pos) {
        if (this.indicator === undefined)
            return;
        bus.dispatch(new SetPayloadEvent(this.indicator, {
            type: 'POSITION',
            payload: pos,
        }), /* spammy */ true);
    }
    onUp(pos) {
        this.reset();
    }
    onCancel() {
        this.reset();
    }
}
