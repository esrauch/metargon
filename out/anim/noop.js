// A noop is just a settimeout animation. Probably we should do it
// with a bus listener counting ticks for consistency with pausing when the screen isn't active.
// but whatever
export function noopAnimation(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
