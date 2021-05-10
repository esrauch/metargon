import { crossFadeScreen } from "./screens/screen.js";
import { ChessScreen } from "./screens/chess/chess_screen.js";
import { SplashScreen } from "./screens/splash/splash_screen.js";
export function initClickPuzzle() {
    const main = new ChessScreen();
    crossFadeScreen(new SplashScreen(main));
}
