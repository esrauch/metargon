import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { delta, Pos, Vec } from "../coords/coords.js";
import { CreateEntity, DestroyEntity } from "../events/core_entity_events.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { SetPayloadEvent } from "../events/payload_events.js";
import { SetVelocity } from "../events/physics_events.js";
import { Id } from "../payloads/entity_id.js";
import { PhysicsEntityCategory } from "../payloads/physics_payload.js";
import { getCenterPosition } from "../systems/getters.js";
import { physics } from "../systems/physics/physics.js";
import { Control } from "./control.js";

// See the Physics system for Magnet impl.
export class MagnetControl extends Control implements BusListener {
    private indicator ?: Id;
    private selected ?: Id;

    private reset() {
        if (this.indicator) bus.dispatch(new DestroyEntity(this.indicator));
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

    onEvent(ev: BusEvent): void {
        if (ev.type !== 'TICK') return;
        if (!this.selected || !this.indicator) return;

        const selectedPos = getCenterPosition(this.selected);
        const indicatorPos = getCenterPosition(this.indicator)
        const v = delta(indicatorPos, selectedPos).normalizeIfLongerThan(200);

        bus.dispatch(new SetVelocity(this.selected, v), /* spammy */ false);
    }

    onDown(pos: Pos) {
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

    onMove(pos: Pos) {
        if (this.indicator === undefined) return;
        bus.dispatch(new SetPayloadEvent(this.indicator, {
            type: 'POSITION',
            payload: pos,
        }), /* spammy */ true);
    }

    onUp(pos: Pos) {
        this.reset();
    }
    onCancel() {
        this.reset();
    }
}