// Manages the currently active Screen.
import { makeFadeScreenAnimation } from "../anim/screen_fade.js";
import { bus } from "../bus/bus.js";
import { LevelChanged } from "../events/reset_all_systems_event.js";
import { ScreenFullyShown } from "../events/screen_fully_shown_event.js";
import { Color } from "../gfx/gfx.js";
import { getLevelNumber } from "../levels/level.js";
export var FadeSpeed;
(function (FadeSpeed) {
    FadeSpeed[FadeSpeed["INSTANT"] = 0] = "INSTANT";
    FadeSpeed[FadeSpeed["FAST"] = 0.5] = "FAST";
    FadeSpeed[FadeSpeed["SLOW"] = 1] = "SLOW";
    FadeSpeed[FadeSpeed["DEFAULT"] = 1] = "DEFAULT";
})(FadeSpeed || (FadeSpeed = {}));
export class LevelSystem {
    constructor() {
        window.addEventListener('hashchange', () => {
            this.switchToLevelFromHashOrFirst();
        });
    }
    onEvent(ev) {
        var _a, _b;
        switch (ev.type) {
            case 'WIN':
                this.crossFadeLevel(((_a = this.activeLevelNumber) !== null && _a !== void 0 ? _a : 0) + 1, Color.GRASS);
                break;
            case 'LOSE':
                this.crossFadeLevel(((_b = this.activeLevelNumber) !== null && _b !== void 0 ? _b : 0), Color.FIRE, FadeSpeed.FAST);
                break;
        }
    }
    switchToLevelFromHashOrFirst() {
        const targetLevel = +document.location.hash.substring(1);
        if (targetLevel === this.activeLevelNumber)
            return;
        this.crossFadeLevel(targetLevel);
    }
    crossFadeLevel(nextLevelNumber, temporaryForegroundColor, fadeSpeed = FadeSpeed.DEFAULT) {
        const next = getLevelNumber(nextLevelNumber);
        if (this.activeAnimation) {
            console.error('cannot start a new anim until last one is done');
            return;
        }
        // First time we try to crossfade force the "fade-out" to be instant to 
        // immediately start fading in the new screen. Otherwise respect the provided
        // FadeSpeed.
        this.activeAnimation = makeFadeScreenAnimation('OUT', this.activeLevel ? fadeSpeed : FadeSpeed.INSTANT, temporaryForegroundColor);
        this.activeAnimation.then(() => {
            this.instantSwapInLevel(nextLevelNumber, next);
            this.activeAnimation = makeFadeScreenAnimation('IN', fadeSpeed);
            return this.activeAnimation;
        }).then(() => {
            this.activeAnimation = undefined;
            bus.dispatch(new ScreenFullyShown());
        });
    }
    instantSwapInLevel(num, a) {
        if (this.activeLevel)
            this.activeLevel.deactivate();
        bus.dispatch(new LevelChanged());
        this.activeLevelNumber = num;
        this.activeLevel = a;
        a.activate();
        document.location.hash = `${num}`;
    }
}
LevelSystem.singleton = new LevelSystem();
const levelSystem = LevelSystem.singleton;
export { levelSystem };
