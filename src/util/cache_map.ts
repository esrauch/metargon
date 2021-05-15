
export class CacheMap<K,V> {
    readonly map = new Map<K, V>();

    get(k: K, create: () => V) {
        const cached = this.map.get(k);
        if (cached) return cached;
        const v = create();
        this.map.set(k, v);
        return v;
    }
}