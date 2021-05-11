import { fadeScreen } from "../anim/screen_fade.js";
import { activateNullControl } from "../controls/controls.js";
import { resetAllSystems } from "../systems/all_systems.js";
var FadeSpeed;
(function (FadeSpeed) {
    FadeSpeed[FadeSpeed["INSTANT"] = 0] = "INSTANT";
    //SLOW = 200/60,
    //SLOW = 0,
    FadeSpeed[FadeSpeed["SLOW"] = 0.5] = "SLOW";
})(FadeSpeed || (FadeSpeed = {}));
let activeScreen;
let activeAnimation;
export function crossFadeScreen(next, fadeSpeed = FadeSpeed.SLOW) {
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
        var _a;
        activeAnimation = undefined;
        (_a = activeScreen === null || activeScreen === void 0 ? void 0 : activeScreen.fullyShown) === null || _a === void 0 ? void 0 : _a.call(activeScreen);
    });
}
function instantSwapInScreen(a) {
    var _a;
    if (activeScreen)
        (_a = activeScreen.deactivate) === null || _a === void 0 ? void 0 : _a.call(activeScreen);
    resetAllSystems();
    activateNullControl();
    activeScreen = a;
    a.activate();
}
