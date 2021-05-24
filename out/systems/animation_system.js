export class AnimationSystem {
    constructor() {
        this.animations = [];
    }
    onEvent(ev) {
        switch (ev.type) {
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
    addAnimation(animation) {
        this.animations.push(animation);
    }
    removeAnimationsForEntity(id) {
        this.animations = this.animations.filter((anim) => anim.entityId !== id);
    }
    tick() {
        const toRemove = new Set();
        for (const anim of this.animations) {
            if (anim.isDone())
                toRemove.add(anim);
            else
                anim.tick();
        }
        if (toRemove.size > 0)
            this.animations = this.animations.filter((value) => !toRemove.has(value));
    }
}
AnimationSystem.singleton = new AnimationSystem();
const animationSystem = AnimationSystem.singleton;
export { animationSystem };
