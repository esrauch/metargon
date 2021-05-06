
export type Id = number;

let nextId: Id = 0;

export function makeEntityId(): Id {
    return nextId++;
}