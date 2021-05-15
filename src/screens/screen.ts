import { makeFadeScreenAnimation } from "../anim/screen_fade.js";
import { activateNullControl } from "../controls/controls.js";
import { COLOR } from "../gfx/gfx.js";
import { resetAllSystems } from "../systems/all_systems.js";

export enum FadeSpeed {
    INSTANT = 0,
    //SLOW = 200/60,
    //SLOW = 0,
    SLOW = 0.5,

    DEFAULT = SLOW,
}

export interface ActiveScreen {
    activate: () => void;
    deactivate?: () => void;

    // Called when any fade in animations are done.
    fullyShown?: () => void;
}

let activeScreen: ActiveScreen|undefined;
let activeAnimation: Promise<void>|undefined;

export function crossFadeScreen(
    next: ActiveScreen,
    fadeSpeed: FadeSpeed = FadeSpeed.DEFAULT,
    temporaryForegroundColor?: COLOR) {
    if (activeAnimation) {
        console.error('cannot start a new anim until last one is done');
        return;
    }
    
    // First time we try to crossfade force the "fade-out" to be instant to 
    // immediately start fading in the new screen. Otherwise respect the provided
    // FadeSpeed.
    activeAnimation = makeFadeScreenAnimation(
        'OUT',
        activeScreen ? fadeSpeed : FadeSpeed.INSTANT,
        temporaryForegroundColor);

    activeAnimation.then(() => {
        instantSwapInScreen(next);
        activeAnimation = makeFadeScreenAnimation('IN', fadeSpeed);
        return activeAnimation;
    }).then(() => {
        activeAnimation = undefined;
        activeScreen?.fullyShown?.();
    })
}


function instantSwapInScreen(a: ActiveScreen) {
    if (activeScreen) activeScreen.deactivate?.();
    resetAllSystems();
    activateNullControl();
    activeScreen = a;
    a.activate();
}