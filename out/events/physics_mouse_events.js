export var PhysicsControls;
(function (PhysicsControls) {
    PhysicsControls[PhysicsControls["MAG"] = 1] = "MAG";
    PhysicsControls[PhysicsControls["LOCK"] = 2] = "LOCK";
})(PhysicsControls || (PhysicsControls = {}));
export class EnablePhysicsMouse {
    constructor(which) {
        this.which = which;
        this.type = 'ENABLE_PHYSICS_MOUSE';
    }
}
export class DisablePhysicsMouse {
    constructor() {
        this.type = 'DISABLE_PHYSICS_MOUSE';
    }
}
