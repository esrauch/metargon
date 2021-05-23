
export type Id = number;

export const PLAYER: Id = -1;

let nextId: Id = 1;

export function makeEntityId(): Id {
    return nextId++;
}