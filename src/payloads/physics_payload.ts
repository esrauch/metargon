
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

export enum PhysicsEntityCategory {
    PLAYER = 1<<0,
    NORMAL = 1<<2,
    MAGNETIC = 1<<2,
    NO_COLLIDE_WITH_PLAYER = 1<<3,
}

export interface PhysicsPayload {
    readonly hull: CircleHull | RectangleHull,
    readonly isStatic?: boolean,
    readonly restitution?: number,  // How "elastic" it is (default 0.8)
    readonly entityCategory?: PhysicsEntityCategory,
    readonly nonRotating?: boolean,
}

export interface PhysicsTypedPayload extends TypedPayload<PhysicsPayload> {
    readonly type: 'PHYSICS'
}