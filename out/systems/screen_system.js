// Manages the currently active Screen.
import { makeFadeScreenAnimation } from "../anim/screen_fade.js";
import { bus } from "../bus/bus.js";
import { ResetAllSystems } from "../events/reset_all_systems_event.js";
import { ScreenFullyShown } from "../events/screen_fully_shown_event.js";
import { Color } from "../gfx/gfx.js";
import { getScreenNumber } from "../screens/screen.js";
export var FadeSpeed;
(function (FadeSpeed) {
    FadeSpeed[FadeSpeed["INSTANT"] = 0] = "INSTANT";
    FadeSpeed[FadeSpeed["FAST"] = 0.75] = "FAST";
    FadeSpeed[FadeSpeed["SLOW"] = 2] = "SLOW";
    FadeSpeed[FadeSpeed["DEFAULT"] = 2] = "DEFAULT";
})(FadeSpeed || (FadeSpeed = {}));
export class ScreenSystem {
    constructor() { }
    onEvent(ev) {
        var _a, _b;
        switch (ev.type) {
            case 'WIN':
                this.crossFadeScreen(((_a = this.activeScreenNumber) !== null && _a !== void 0 ? _a : 0) + 1, Color.GRASS);
                break;
            case 'LOSE':
                this.crossFadeScreen(((_b = this.activeScreenNumber) !== null && _b !== void 0 ? _b : 0), Color.FIRE, FadeSpeed.FAST);
                break;
        }
    }
    startFirstScreen() {
        this.crossFadeScreen(0);
    }
    crossFadeScreen(nextScreenNumber, temporaryForegroundColor, fadeSpeed = FadeSpeed.DEFAULT) {
        const next = getScreenNumber(nextScreenNumber);
        if (this.activeAnimation) {
            console.error('cannot start a new anim until last one is done');
            return;
        }
        // First time we try to crossfade force the "fade-out" to be instant to 
        // immediately start fading in the new screen. Otherwise respect the provided
        // FadeSpeed.
        this.activeAnimation = makeFadeScreenAnimation('OUT', this.activeScreen ? fadeSpeed : FadeSpeed.INSTANT, temporaryForegroundColor);
        this.activeAnimation.then(() => {
            this.instantSwapInScreen(nextScreenNumber, next);
            this.activeAnimation = makeFadeScreenAnimation('IN', fadeSpeed);
            return this.activeAnimation;
        }).then(() => {
            this.activeAnimation = undefined;
            bus.dispatch(new ScreenFullyShown());
        });
    }
    instantSwapInScreen(num, a) {
        if (this.activeScreen)
            this.activeScreen.deactivate();
        bus.dispatch(new ResetAllSystems());
        this.activeScreenNumber = num;
        this.activeScreen = a;
        a.activate();
    }
}
ScreenSystem.singleton = new ScreenSystem();
const screenSystem = ScreenSystem.singleton;
export { screenSystem };
