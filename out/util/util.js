export function assert(x) {
    if (!x)
        throw new Error();
    return x;
}
