export function assert<T extends {}>(x: T|null|undefined): T {
    if (!x) throw new Error();
    return x;
}

export function assertUnreachable(x: never): never {
    throw new Error('Hit "unreachable" path!');
}
