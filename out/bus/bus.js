// The Bus is a single global point where everything flows through.
// At least for now, all possible event types are centrally defined here.
export class Bus {
    constructor() {
        // Listeners are an _ordered_ list (both ticks and draws might be heavily
        // ordered dependent).
        this.listeners = [];
        this.logAllEventsBesidesTickAndDraw = true;
        this.logTickAndDraw = false;
    }
    dispatch(ev) {
        const isTickOrDraw = ev.type == 'TICK' || ev.type == 'DRAW';
        if ((this.logAllEventsBesidesTickAndDraw && !isTickOrDraw) ||
            (this.logTickAndDraw && isTickOrDraw)) {
            console.log(JSON.stringify(ev));
        }
        for (const l of this.listeners) {
            l.onEvent(ev);
        }
    }
    addListener(l) {
        if (new Set(this.listeners).has(l)) {
            console.error('tried to double add a listener to bus');
        }
        else {
            this.listeners.push(l);
        }
    }
    addListeners(ls) {
        for (const l of ls)
            this.addListener(l);
    }
    removeListener(l) {
        const ls = this.listeners;
        if (!new Set(ls).has(l)) {
            console.error('tried to double add a listener to bus');
        }
        else {
            for (let i = 0; i < this.listeners.length; ++i) {
                if (ls[i] == l)
                    ls.splice(i, 1);
            }
        }
    }
}
Bus.singleton = new Bus();
const bus = Bus.singleton;
export { bus };
