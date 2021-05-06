
// When objects are created, if they have any EntityPhysicsData attached then
// its position will be managed/updated by the Physics engine.

interface CircleHull {
    type: 'CIRCLE',
    radius: number,
}

interface RectangleHull {
    type: 'RECT',
    width: number,
    height: number,
}

interface EntityPhysicsOptions {
    static?: boolean,
    restitution?: number,   // How "elastic" it is (default 0.8)

    hull: CircleHull | RectangleHull
}