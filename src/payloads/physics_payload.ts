
// When objects are created, if they have any EntityPhysicsData attached then
// its position will be managed/updated by the Physics engine.

import { TypedPayload } from "./payload.js";

interface CircleHull {
    type: 'CIRCLE',
    radius: number,
}

interface RectangleHull {
    type: 'RECT',
    width: number,
    height: number,
}

export interface PhysicsPayload {
    readonly hull: CircleHull | RectangleHull,
    readonly isStatic?: boolean,
    readonly restitution?: number  // How "elastic" it is (default 0.8)
}

export interface PhysicsTypedPayload extends TypedPayload<PhysicsPayload> {
    readonly type: 'PHYSICS'
}