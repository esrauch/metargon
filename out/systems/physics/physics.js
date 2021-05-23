/// <reference types="./matter" />
import { bus } from "../../bus/bus.js";
import { Pos, VHEIGHT, Positions } from "../../coords/coords.js";
import { getCenterPosition, getLabel } from "../getters.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { assertUnreachable } from "../../util/assert.js";
import { camera } from "../../coords/camera.js";
import { PhysicsControls } from "../../events/physics_mouse_events.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
// Importing a js module with ts typings is incredibly difficult for some reason.
// Matter should be loaded as a module, but instead we just
// load it into the global namespace in index.html.
const M = window.Matter;
const STEP = 1000 / 60;
export class Physics {
    constructor() {
        this.debugUi = {
            renderHulls: false,
        };
        this.tickCount = 0;
        this.pendingUnlocks = new Map();
        this.engine = M.Engine.create({
            gravity: {
                y: VHEIGHT / 600,
            }
        });
        this.mouse = M.Mouse.create(document.querySelector('canvas'));
    }
    getBody(id) {
        return M.Composite.get(this.engine.world, id, 'body');
    }
    getPosition(id) {
        const body = this.getBody(id);
        if (!body)
            return undefined;
        return new Pos(body.position.x, body.position.y);
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'LEVEL_CHANGED':
                this.reset();
                break;
            case 'TICK':
                this.tick();
                break;
            case 'DRAW':
                this.draw(ev);
                break;
            case 'APPLY_FORCE':
                this.applyForce(ev);
                break;
            case 'SET_VELOCITY':
                this.setVelocity(ev);
                break;
            case 'ROLL_MOVE':
                this.rollMove(ev);
                break;
            case 'SET_PAYLOAD':
                if (ev.typedPayload.type == 'PHYSICS')
                    this.setPhysicsPayload(ev.entityId, ev.typedPayload);
                if (ev.typedPayload.type == 'POSITION')
                    this.maybeSetPosition(ev.entityId, ev.typedPayload);
                if (ev.typedPayload.type == 'LOCKED')
                    if (ev.typedPayload.payload)
                        this.lock(ev.entityId);
                    else
                        this.unlock(ev.entityId);
                break;
            case 'CLEAR_PAYLOAD':
                if (ev.payloadType == 'PHYSICS')
                    this.destroyEntity(ev.entityId);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev.entityId);
                break;
            case 'VIEWPORT_CHANGED':
                this.onViewportChanged();
                break;
            case 'ENABLE_PHYSICS_MOUSE':
                this.enablePhysicsMouse(ev.which);
                break;
            case 'DISABLE_PHYSICS_MOUSE':
                this.disablePhysicsMouse();
                break;
            case 'CHANGE_PHYSICS_ENTITY_CATEGORY':
                this.setEntityCategory(ev.entityId, ev.physicsEntityCategory);
                break;
        }
    }
    reset() {
        this.tickCount = 0;
        this.pendingUnlocks.clear();
        M.Engine.clear(this.engine);
        M.Composite.clear(this.engine.world, false, true);
        this.disablePhysicsMouse();
    }
    tick() {
        this.tickCount++;
        for (const [id, tickTarget] of this.pendingUnlocks) {
            if (tickTarget === this.tickCount) {
                bus.dispatch(new SetPayloadEvent(id, {
                    type: 'LOCKED',
                    payload: false,
                }));
            }
        }
        M.Engine.update(this.engine, STEP);
    }
    draw(ev) {
        if (this.debugUi.renderHulls) {
            for (const b of M.Composite.allBodies(this.engine.world)) {
                ev.gfx.lineloop(new Positions(b.vertices.map(v => [v.x, v.y])));
            }
        }
    }
    setVelocity(ev) {
        const body = this.getBody(ev.entityId);
        if (!body) {
            console.error(`setvelocity on unknown body ${ev.entityId}`);
            return;
        }
        const vec = ev.newVelocity;
        const arbitraryNerf = 1 / 5;
        const fx = vec.dx * arbitraryNerf;
        const fy = vec.dy * arbitraryNerf;
        M.Body.setVelocity(body, M.Vector.create(fx, fy));
    }
    rollMove(ev) {
        const body = this.getBody(ev.entityId);
        if (!body) {
            console.error(`rollmove on unknown body ${ev.entityId}`);
            return;
        }
        const V = 20;
        // A move can't make us slow down for in the direction we're already going.
        if (Math.sign(body.velocity.x) == Math.sign(ev.dir) && V < Math.abs(body.velocity.x)) {
            return;
        }
        const newVelocity = M.Vector.create(V * ev.dir, body.velocity.y);
        M.Body.setVelocity(body, newVelocity);
    }
    applyForce(ev) {
        const body = this.getBody(ev.entityId);
        if (!body) {
            console.error(`applyforce on unknown body ${ev.entityId}`);
            return;
        }
        const vec = ev.force;
        const arbitraryNerf = 1 / 200;
        const fx = vec.dx * arbitraryNerf;
        const fy = vec.dy * arbitraryNerf;
        M.Body.applyForce(body, body.position, M.Vector.create(fx, fy));
    }
    setPhysicsPayload(id, payload) {
        const preexistingBody = this.getBody(id);
        if (preexistingBody) {
            M.Composite.remove(this.engine.world, preexistingBody);
        }
        const physicsOptions = payload.payload;
        if (!physicsOptions)
            return;
        const initialPos = getCenterPosition(id);
        const label = getLabel(id);
        const hull = physicsOptions.hull;
        const opts = {
            id,
            label,
            restitution: physicsOptions.restitution || 0.8,
            isStatic: physicsOptions.isStatic,
            friction: 0.3,
            inertia: physicsOptions.nonRotating ? Infinity : undefined,
        };
        switch (hull.type) {
            case 'CIRCLE':
                const ball = M.Bodies.circle(initialPos.x, initialPos.y, hull.radius, opts);
                M.Composite.add(this.engine.world, ball);
                break;
            case 'RECT':
                const rect = M.Bodies.rectangle(initialPos.x, initialPos.y, hull.width, hull.height, opts);
                M.Composite.add(this.engine.world, rect);
                break;
            default:
                return assertUnreachable(hull);
        }
        this.setEntityCategory(id, physicsOptions.entityCategory);
    }
    setEntityCategory(id, category = PhysicsEntityCategory.NORMAL) {
        const b = this.getBody(id);
        if (!b)
            return;
        b.collisionFilter.category = category;
        switch (category) {
            case PhysicsEntityCategory.NO_COLLIDE_WITH_PLAYER:
                b.collisionFilter.mask = ~PhysicsEntityCategory.PLAYER;
                break;
            case PhysicsEntityCategory.PLAYER:
                b.collisionFilter.mask = ~PhysicsEntityCategory.NO_COLLIDE_WITH_PLAYER;
                break;
            default:
                b.collisionFilter.mask = ~0;
        }
    }
    maybeSetPosition(id, typedPayload) {
        const body = this.getBody(id);
        if (!body)
            return;
        M.Body.setPosition(body, M.Vector.create(typedPayload.payload.x, typedPayload.payload.y));
    }
    destroyEntity(id) {
        const body = this.getBody(id);
        if (body)
            M.Composite.remove(this.engine.world, body);
    }
    onViewportChanged() {
        M.Mouse.setOffset(this.mouse, M.Vector.create(-camera.vleftoff, -camera.vtopoff));
        const scale = 1 / camera.mult;
        M.Mouse.setScale(this.mouse, M.Vector.create(scale, scale));
    }
    enablePhysicsMouse(which) {
        if (this.mouseConstraint)
            return;
        if (which === PhysicsControls.MAG) {
            this.mouseConstraint = M.MouseConstraint.create(this.engine, {
                mouse: this.mouse,
                constraint: {
                    stiffness: 0.5,
                },
                collisionFilter: { mask: PhysicsEntityCategory.MAGNETIC }
            });
        }
        else {
            this.mouseConstraint = M.MouseConstraint.create(this.engine, {
                mouse: this.mouse,
                constraint: {
                    stiffness: 0,
                },
                collisionFilter: { mask: PhysicsEntityCategory.MAGNETIC }
            });
            M.Events.on(this.mouseConstraint, 'startdrag', () => {
                var _a;
                const b = (_a = this.mouseConstraint) === null || _a === void 0 ? void 0 : _a.body;
                if (!b)
                    return;
                bus.dispatch(new SetPayloadEvent(b.id, {
                    type: 'LOCKED',
                    payload: !b.isStatic,
                }));
            });
        }
        M.Composite.add(this.engine.world, this.mouseConstraint);
    }
    disablePhysicsMouse() {
        if (!this.mouseConstraint)
            return;
        M.Composite.remove(this.engine.world, this.mouseConstraint);
        this.mouseConstraint = undefined;
    }
    lock(id) {
        const b = this.getBody(id);
        if (!b || this.pendingUnlocks.has(id))
            return;
        M.Body.setStatic(b, true);
        const targetUnlockTick = 3 * 60 + this.tickCount;
        this.pendingUnlocks.set(id, targetUnlockTick);
    }
    unlock(id) {
        this.pendingUnlocks.delete(id);
        const b = this.getBody(id);
        if (!b)
            return;
        M.Body.setStatic(b, false);
    }
}
Physics.singleton = new Physics();
const physics = Physics.singleton;
export { physics };
