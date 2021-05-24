import { Anim } from "./animation.js";


export class ArbitraryAnim implements Anim {
    constructor(
        readonly callback: () => void,
    ) {}

    isDone(): boolean {
        return false;
    }

    tick(): void {
        this.callback();
    }

}