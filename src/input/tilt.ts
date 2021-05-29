import { bus } from "../bus/bus.js";
import { delta, Pos, Vec, VHEIGHT } from "../coords/coords.js";
import { DestroyEntity } from "../events/core_entity_events.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { Id } from "../payloads/entity_id.js";
import { PointerEvtControl } from "./pointer_helper.js";

const indicatorRadius = 300;
const indicatorCenter = new Pos(indicatorRadius, VHEIGHT - indicatorRadius);

export class Tilt extends PointerEvtControl {
    private constructor() { super(); }
    static singleton = new Tilt();

    private indicatorEntity ?: Id;
    private orientationAvailable = false;

    // [-1,-1] -> [1,1] determining the orientation
    dir = new Vec(0, 0);

    private listener = (ev: DeviceOrientationEvent) => this.handleOrientation(ev);
    enable() {
        super.enable();
        this.dir = new Vec(0, 0);
        window.addEventListener('deviceorientation', this.listener);
        this.indicatorEntity = makeEntity({
            initialPos: indicatorCenter,
            label: 'indicator',
            rendering: { type: 'TILT_INDICATOR', r: indicatorRadius }
        });
    }
    disable() {
        super.disable();
        window.removeEventListener('deviceorientation', this.listener);
        if (this.indicatorEntity) bus.dispatch(new DestroyEntity(this.indicatorEntity));
    }

    private handleOrientation(ev: DeviceOrientationEvent) {
        if (!ev.gamma || !ev.beta) return;
        this.orientationAvailable = true;
        this.dir =
            new Vec(ev.gamma ?? 0, ev.beta ?? 0)
                .mult(1/14)
                .normalizeIfLongerThan(1);
    }

    private maybeUpdateOrientation(pos: Pos) {
        // Only do controls on the indicator if the orientation controls are unavailable.
        if (this.orientationAvailable) return;
        const vec = delta(pos, indicatorCenter).mult(1 / indicatorRadius)
        if (vec.length() <= 1) {
            this.dir = vec;
        }
    }

    onDown(pos: Pos): void { this.maybeUpdateOrientation(pos); }
    onMove(pos: Pos): void { this.maybeUpdateOrientation(pos); }
    onUp(pos: Pos): void { this.maybeUpdateOrientation(pos); }
    onCancel(): void {}
}

const tilt = Tilt.singleton;
export {tilt};
