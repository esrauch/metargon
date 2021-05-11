import { crossFadeScreen } from "./screens/screen.js";
import { ChessScreen } from "./screens/chess/chess_screen.js";
import { S00 } from "./screens/00_splash/s00.js";
export function initClickPuzzle() {
    const main = new ChessScreen();
    crossFadeScreen(new S00(main));
}
