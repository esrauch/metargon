export function assert(x) {
    if (!x)
        throw new Error();
    return x;
}
export function assertUnreachable(x) {
    throw new Error('Hit "unreachable" path!');
}
