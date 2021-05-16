/// <reference types="./matter" />

import { ApplyForce, RollMove, SetVelocity } from "../../events/physics_events.js";
import { BusEvent, BusListener } from "../../bus/bus.js";
import { Pos, VHEIGHT, Positions } from "../../coords/coords.js";
import { Draw } from "../../events/draw.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { Id } from "../../payloads/entity_id.js";
import { getCenterPosition, getLabel } from "../getters.js";
import { PhysicsTypedPayload } from "../../payloads/physics_payload.js";
import { assertUnreachable } from "../../util/assert.js";

// Importing a js module with ts typings is incredibly difficult for some reason.
// Matter should be loaded as a module, but instead we just
// load it into the global namespace in index.html.
const M = window.Matter;

const STEP = 1000 / 60;

export class Physics implements BusListener {
    readonly debugUi = {
        renderHulls: false,
    };
    readonly engine: Matter.Engine;

    static singleton = new Physics();

    private constructor() {
        this.engine = M.Engine.create({
            gravity: {
                y: VHEIGHT / 600,
            }
        });
    }

    getBody(id: Id): Matter.Body | undefined {
        return M.Composite.get(this.engine.world, id, 'body') as Matter.Body | undefined;
    }

    getPosition(id: Id): Pos | undefined {
        const body = this.getBody(id);
        if (!body) return undefined;
        return new Pos(body.position.x, body.position.y);
    }

    onEvent(ev: BusEvent): void {
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

    private reset() {
        M.Engine.clear(this.engine);
        M.Composite.clear(this.engine.world, false, true);
    }

    private tick() {
        M.Engine.update(this.engine, STEP);
    }

    private draw(ev: Draw) {
        if (this.debugUi.renderHulls) {
            for (const b of M.Composite.allBodies(this.engine.world)) {
                ev.gfx.lineloop(
                    new Positions(b.vertices.map(v => [v.x, v.y]))
                );
            }
        }
    }

    private setVelocity(ev: SetVelocity) {
        const body = this.getBody(ev.entityId);
        if (!body) {
            console.error(`setvelocity on unknown body ${ev.entityId}`);
            return;
        }
        const vec = ev.newVelocity;
        const arbitraryNerf = 1 / 5;
        const fx = vec.dx * arbitraryNerf;
        const fy = vec.dy * arbitraryNerf;
        M.Body.setVelocity(
            body,
            M.Vector.create(fx, fy)
        );
    }

    private rollMove(ev: RollMove) {
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

    private applyForce(ev: ApplyForce) {
        const body = this.getBody(ev.entityId);
        if (!body) {
            console.error(`applyforce on unknown body ${ev.entityId}`);
            return;
        }
        const vec = ev.force;
        const arbitraryNerf = 1 / 200;
        const fx = vec.dx * arbitraryNerf;
        const fy = vec.dy * arbitraryNerf;
        M.Body.applyForce(
            body,
            body.position,
            M.Vector.create(fx, fy));
    }

    private setPhysicsPayload(id: Id, payload: PhysicsTypedPayload) {
        if (this.getBody(id)) {
            throw Error('Cannot set a physics payload when there already is one');
        }
        const physicsOptions = payload.payload;
        if (!physicsOptions) return;
        const initialPos = getCenterPosition(id);
        const label = getLabel(id);

        const hull = physicsOptions.hull;
        switch (hull.type) {
            case 'CIRCLE':
                const ball = M.Bodies.circle(initialPos.x, initialPos.y, hull.radius,
                    {
                        id,
                        label,
                        restitution: physicsOptions.restitution || 0.8,
                        isStatic: physicsOptions.isStatic,
                        friction: 0.3,
                    });
                M.Composite.add(this.engine.world, ball);
                break;
            case 'RECT':
                const rect = M.Bodies.rectangle(
                    initialPos.x, initialPos.y, hull.width, hull.height, {
                    id,
                    label,
                    restitution: physicsOptions.restitution || 0.8,
                    isStatic: physicsOptions.isStatic,
                    friction: 0.3,
                });
                M.Composite.add(this.engine.world, rect);
                break;
            default:
                return assertUnreachable(hull);
        }
    }

    destroyEntity(id: Id) {
        const body = this.getBody(id);
        if (body) M.Composite.remove(this.engine.world, body);
    }
}

const physics = Physics.singleton;
export { physics };