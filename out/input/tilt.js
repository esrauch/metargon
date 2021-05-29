import { bus } from "../bus/bus.js";
import { delta, Pos, Vec, VHEIGHT } from "../coords/coords.js";
import { DestroyEntity } from "../events/core_entity_events.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { PointerEvtControl } from "./pointer_helper.js";
const indicatorRadius = 300;
const indicatorCenter = new Pos(indicatorRadius, VHEIGHT - indicatorRadius);
export class Tilt extends PointerEvtControl {
    constructor() {
        super();
        this.orientationAvailable = false;
        // [-1,-1] -> [1,1] determining the orientation
        this.dir = new Vec(0, 0);
        this.listener = (ev) => this.handleOrientation(ev);
    }
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
        if (this.indicatorEntity)
            bus.dispatch(new DestroyEntity(this.indicatorEntity));
    }
    handleOrientation(ev) {
        var _a, _b;
        if (!ev.gamma || !ev.beta)
            return;
        this.orientationAvailable = true;
        this.dir =
            new Vec((_a = ev.gamma) !== null && _a !== void 0 ? _a : 0, (_b = ev.beta) !== null && _b !== void 0 ? _b : 0)
                .mult(1 / 14)
                .normalizeIfLongerThan(1);
    }
    maybeUpdateOrientation(pos) {
        // Only do controls on the indicator if the orientation controls are unavailable.
        if (this.orientationAvailable)
            return;
        const vec = delta(pos, indicatorCenter).mult(1 / indicatorRadius);
        if (vec.length() <= 1) {
            this.dir = vec;
        }
    }
    onDown(pos) { this.maybeUpdateOrientation(pos); }
    onMove(pos) { this.maybeUpdateOrientation(pos); }
    onUp(pos) { this.maybeUpdateOrientation(pos); }
    onCancel() { }
}
Tilt.singleton = new Tilt();
const tilt = Tilt.singleton;
export { tilt };
