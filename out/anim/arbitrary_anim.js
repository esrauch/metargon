export class ArbitraryAnim {
    constructor(callback) {
        this.callback = callback;
    }
    isDone() {
        return false;
    }
    tick() {
        this.callback();
    }
}
