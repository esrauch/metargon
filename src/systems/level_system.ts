// Manages the currently active Screen.

import { makeFadeScreenAnimation } from "../anim/screen_fade.js";
import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { LevelChanged } from "../events/reset_all_systems_event.js";
import { ScreenFullyShown } from "../events/screen_fully_shown_event.js";
import { Color } from "../gfx/gfx.js";
import { Level, getLevelNumber } from "../levels/level.js";

export enum FadeSpeed {
    INSTANT = 0,
    FAST = 0.5,
    SLOW = 1,

    DEFAULT = SLOW,
}

export class LevelSystem implements BusListener {
    private constructor() {
        window.addEventListener('hashchange', () => {
            this.switchToLevelFromHashOrFirst();
        });
    }
    static singleton = new LevelSystem();

    private activeLevelNumber?: number;
    private activeLevel?: Level;

    private activeAnimation?: Promise<void>;

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'WIN':
                this.crossFadeLevel((this.activeLevelNumber ?? 0) + 1, Color.GRASS);
                break;
            case 'LOSE':
                this.crossFadeLevel((this.activeLevelNumber ?? 0), Color.FIRE, FadeSpeed.FAST);
                break;
        }
    }

    switchToLevelFromHashOrFirst() {
        const targetLevel = +document.location.hash.substring(1);
        if (targetLevel === this.activeLevelNumber) return;
        this.crossFadeLevel(targetLevel);
    }

    private crossFadeLevel(
        nextLevelNumber: number,
        temporaryForegroundColor?: Color,
        fadeSpeed: FadeSpeed = FadeSpeed.DEFAULT) {

        const next = getLevelNumber(nextLevelNumber);

        if (this.activeAnimation) {
            console.error('cannot start a new anim until last one is done');
            return;
        }

        // First time we try to crossfade force the "fade-out" to be instant to 
        // immediately start fading in the new screen. Otherwise respect the provided
        // FadeSpeed.
        this.activeAnimation = makeFadeScreenAnimation(
            'OUT',
            this.activeLevel ? fadeSpeed : FadeSpeed.INSTANT,
            temporaryForegroundColor);

        this.activeAnimation.then(() => {
            this.instantSwapInLevel(nextLevelNumber, next);
            this.activeAnimation = makeFadeScreenAnimation('IN', fadeSpeed);
            return this.activeAnimation;
        }).then(() => {
            this.activeAnimation = undefined;
            bus.dispatch(new ScreenFullyShown());
        })
    }

    private instantSwapInLevel(num: number, a: Level) {
        if (this.activeLevel) this.activeLevel.deactivate();
        bus.dispatch(new LevelChanged());
        this.activeLevelNumber = num;
        this.activeLevel = a;
        a.activate();
        document.location.hash = `${num}`;
    }
}

const levelSystem = LevelSystem.singleton;
export { levelSystem };