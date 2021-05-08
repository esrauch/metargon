// A noop is just a settimeout animation. Probably we should do it
// with a bus listener counting ticks for consistency, but whatever.
export function noopAnimation(
    seconds: number
): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    })
}
