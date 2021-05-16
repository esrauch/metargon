// Manages the currently active Screen.

import { makeFadeScreenAnimation } from "../anim/screen_fade.js";
import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { ResetAllSystems } from "../events/reset_all_systems_event.js";
import { COLOR } from "../gfx/gfx.js";
import { ActiveScreen, getScreenNumber } from "../screens/screen.js";

export enum FadeSpeed {
    INSTANT = 0,
    //SLOW = 200/60,
    //SLOW = 0,
    SLOW = 0.5,

    DEFAULT = SLOW,
}

export class ScreenSystem implements BusListener {
    private constructor() { }
    static singleton = new ScreenSystem();

    private activeScreenNumber?: number;
    private activeScreen?: ActiveScreen;

    private activeAnimation?: Promise<void>;

    onEvent(ev: BusEvent): void {
        switch (ev.type) {
            case 'WIN':
                this.crossFadeScreen((this.activeScreenNumber ?? 0) + 1, COLOR.GRASS);
                break;
            case 'LOSE':
                this.crossFadeScreen((this.activeScreenNumber ?? 0), COLOR.FIRE);
                break;
        }
    }

    startFirstScreen() {
        this.crossFadeScreen(0);
    }

    private crossFadeScreen(
        nextScreenNumber: number,
        temporaryForegroundColor?: COLOR,
        fadeSpeed: FadeSpeed = FadeSpeed.DEFAULT) {

        const next = getScreenNumber(nextScreenNumber);

        if (this.activeAnimation) {
            console.error('cannot start a new anim until last one is done');
            return;
        }

        // First time we try to crossfade force the "fade-out" to be instant to 
        // immediately start fading in the new screen. Otherwise respect the provided
        // FadeSpeed.
        this.activeAnimation = makeFadeScreenAnimation(
            'OUT',
            this.activeScreen ? fadeSpeed : FadeSpeed.INSTANT,
            temporaryForegroundColor);

        this.activeAnimation.then(() => {
            this.instantSwapInScreen(nextScreenNumber, next);
            this.activeAnimation = makeFadeScreenAnimation('IN', fadeSpeed);
            return this.activeAnimation;
        }).then(() => {
            this.activeAnimation = undefined;
            this.activeScreen?.fullyShown?.();
        })
    }


    private instantSwapInScreen(num: number, a: ActiveScreen) {
        if (this.activeScreen) this.activeScreen.deactivate?.();
        bus.dispatch(new ResetAllSystems());
        this.activeScreenNumber = num;
        this.activeScreen = a;
        a.activate();
    }
}

const screenSystem = ScreenSystem.singleton;
export { screenSystem };