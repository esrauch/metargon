import { fadeScreen } from "../anim/screen_fade.js";

enum FadeSpeed {
    INSTANT = 0,
    SLOW = 200/60,
}

export interface ActiveScreen {
    activate(): void;
    deactivate(): void;

    // Called when any fade in animations are done.
    fullyShown(): void;
}

let activeScreen: ActiveScreen|undefined;
let activeAnimation: Promise<void>|undefined;

export function crossFadeScreen(
    next: ActiveScreen,
    fadeSpeed: FadeSpeed = FadeSpeed.SLOW) {
    if (activeAnimation) {
        console.error('cannot start a new anim until last one is done');
        return;
    }
    
    // First time we try to crossfade force the "fade-out" to be instant to 
    // immediately start fading in the new screen. Otherwise respect the provided
    // FadeSpeed.
    activeAnimation = fadeScreen('OUT', activeScreen ? fadeSpeed : FadeSpeed.INSTANT);

    activeAnimation.then(() => {
        instantSwapInScreen(next);
        activeAnimation = fadeScreen('IN', fadeSpeed);
        return activeAnimation;
    }).then(() => {
        activeAnimation = undefined;
        activeScreen?.fullyShown();
    })
}


function instantSwapInScreen(a: ActiveScreen) {
    if (activeScreen) activeScreen.deactivate();
    activeScreen = a;
    a.activate();
}