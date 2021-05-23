// When objects are created, if they have any EntityPhysicsData attached then
// its position will be managed/updated by the Physics engine.
export var PhysicsEntityCategory;
(function (PhysicsEntityCategory) {
    PhysicsEntityCategory[PhysicsEntityCategory["PLAYER"] = 1] = "PLAYER";
    PhysicsEntityCategory[PhysicsEntityCategory["NORMAL"] = 4] = "NORMAL";
    PhysicsEntityCategory[PhysicsEntityCategory["MAGNETIC"] = 4] = "MAGNETIC";
    PhysicsEntityCategory[PhysicsEntityCategory["NO_COLLIDE_WITH_PLAYER"] = 8] = "NO_COLLIDE_WITH_PLAYER";
    PhysicsEntityCategory[PhysicsEntityCategory["COLLIDE_ONLY_WITH_PLAYER"] = 16] = "COLLIDE_ONLY_WITH_PLAYER";
})(PhysicsEntityCategory || (PhysicsEntityCategory = {}));
