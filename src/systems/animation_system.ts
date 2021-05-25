import { Anim } from "../anim/animation.js";
import { CyclicMoveAnimation } from "../anim/cyclic_move.js";
import { BusEvent, BusListener } from "../bus/bus.js";
import { Id } from "../payloads/entity_id.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { isLocked } from "./getters.js";


export class AnimationSystem implements BusListener {
    private constructor() {}
    static singleton = new AnimationSystem();

    private animations: Anim[] = [];

    onEvent(ev: BusEvent): void {
        switch(ev.type) {
            case 'LEVEL_CHANGED':
                this.animations = [];
                break;
            case 'TICK':
                this.tick();
                break;
            case 'DESTROY_ENTITY':
                this.removeAnimationsForEntity(ev.entityId);
                break;
        }
    }

    start(animation: Anim) {
        this.animations.push(animation);
    }

    private removeAnimationsForEntity(id: Id) {
        this.animations = this.animations.filter(
            (anim) => anim.entityId !== id
        );

    }

    private tick() {
        const toRemove = new Set();
        for (const anim of this.animations) {
            //const locked = anim.entityId && isLocked(anim.entityId);
            //if (locked) continue;
            if (anim.isDone()) toRemove.add(anim);
            else anim.tick();
        }
        if (toRemove.size > 0)
            this.animations = this.animations.filter((value) => !toRemove.has(value));
    }
}

const animationSystem = AnimationSystem.singleton;
export {animationSystem};