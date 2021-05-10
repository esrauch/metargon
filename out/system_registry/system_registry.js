// SystemRegistry is the singleton place where systems
export class Singletons {
    constructor() { }
    static get() {
        return this.s;
    }
}
Singletons.s = new Singletons();
