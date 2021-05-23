export const PLAYER = -1;
let nextId = 1;
export function makeEntityId() {
    return nextId++;
}
