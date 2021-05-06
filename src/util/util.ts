export function assert<T extends {}>(x: T|null|undefined): T {
    if (!x) throw new Error();
    return x;
}