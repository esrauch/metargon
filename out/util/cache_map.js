export class CacheMap {
    constructor() {
        this.map = new Map();
    }
    get(k, create) {
        const cached = this.map.get(k);
        if (cached)
            return cached;
        const v = create();
        this.map.set(k, v);
        return v;
    }
}
