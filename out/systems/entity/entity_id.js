export const PLAYER = -1;
let nextId = 0;
export function makeEntityId() {
    return nextId++;
}
