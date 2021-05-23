

export enum PhysicsControls {
    MAG = 1,
    LOCK = 2,
}

export class EnablePhysicsMouse {
    readonly type = 'ENABLE_PHYSICS_MOUSE'
    constructor(readonly which: PhysicsControls) { }
}

export class DisablePhysicsMouse {
    readonly type = 'DISABLE_PHYSICS_MOUSE'
}
