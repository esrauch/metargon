

// TODO: Ported Mag off of PhysicsMouse, should do the same for lock.
export enum PhysicsControls {
    LOCK = 2,
}

export class EnablePhysicsMouse {
    readonly type = 'ENABLE_PHYSICS_MOUSE'
    constructor(readonly which: PhysicsControls) { }
}

export class DisablePhysicsMouse {
    readonly type = 'DISABLE_PHYSICS_MOUSE'
}
