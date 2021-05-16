/// <reference types="./matter" />
import { Pos, VHEIGHT, Positions } from "../../coords/coords.js";
import { getCenterPosition, getLabel } from "../getters.js";
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
        this.engine = M.Engine.create({
            gravity: {
                y: VHEIGHT / 600,
            }
        });
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
            case 'RESET_ALL_SYSTEMS':
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
                break;
            case 'CLEAR_PAYLOAD':
                if (ev.payloadType == 'PHYSICS')
                    this.destroyEntity(ev.entityId);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev.entityId);
                break;
        }
    }
    reset() {
        M.Engine.clear(this.engine);
        M.Composite.clear(this.engine.world, false, true);
    }
    tick() {
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
        // Apply the force offset from the center to cause some torque.
        // const bodyPos = body.position;
        // M.Body.applyForce(body,
        //     M.Vector.create(bodyPos.x, bodyPos.y - 30),
        //     M.Vector.create(ev.dir, 0));
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
        if (this.getBody(id)) {
            throw Error('Cannot set a physics payload when there already is one');
        }
        const physicsOptions = payload.payload;
        if (!physicsOptions)
            return;
        const initialPos = getCenterPosition(id);
        const label = getLabel(id);
        const hull = physicsOptions.hull;
        switch (hull.type) {
            case 'CIRCLE':
                const ball = M.Bodies.circle(initialPos.x, initialPos.y, hull.radius, {
                    id,
                    label,
                    restitution: physicsOptions.restitution || 0.8,
                    isStatic: physicsOptions.isStatic,
                    friction: 0.3,
                });
                M.Composite.add(this.engine.world, ball);
                break;
            case 'RECT':
                const rect = M.Bodies.rectangle(initialPos.x, initialPos.y, hull.width, hull.height, {
                    id,
                    label,
                    restitution: physicsOptions.restitution || 0.8,
                    isStatic: physicsOptions.isStatic,
                    friction: 0.3,
                });
                M.Composite.add(this.engine.world, rect);
                break;
            default:
                throw Error('Unknown hull type!');
        }
    }
    destroyEntity(id) {
        const body = this.getBody(id);
        if (body)
            M.Composite.remove(this.engine.world, body);
    }
}
Physics.singleton = new Physics();
const physics = Physics.singleton;
export { physics };
