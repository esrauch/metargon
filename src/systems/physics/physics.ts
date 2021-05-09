/// <reference types="./matter" />

import { ApplyForce, SetVelocity } from "../../events/physics.js";
import { BusEvent, BusListener } from "../../bus/bus.js";
import { Pos, VHEIGHT, Positions } from "../../coords/coords.js";
import { Draw } from "../../events/draw.js";
import { DestroyEntity } from "../../events/core_entity_events.js";
import { Id } from "../../payloads/entity_id.js";
import { getCenterPosition } from "../multi_table_getters.js";
import { PhysicsPayload } from "../../payloads/physics_payload.js";
import { coreTable } from "../core_table.js";

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
            case 'SET_PAYLOAD':
                if (ev.payload.type == 'PHYSICS')
                    this.setPhysicsPayload(ev.entityId, ev.payload);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev);
                break;
        }
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

    private setPhysicsPayload(id: Id, payload: PhysicsPayload) {
        if (this.getBody(id)) {
            throw Error('Cannot set a physics payload when there already is one');
        }
        const physicsOptions = payload.value;
        if (!physicsOptions) return;
        const initialPos = getCenterPosition(id);
        const label = coreTable.getLabel(id)

        const hull = physicsOptions.hull;
        switch (hull.type) {
            case 'CIRCLE':
                const ball = M.Bodies.circle(initialPos.x, initialPos.y, hull.radius,
                    {
                        id,
                        label,
                        restitution: physicsOptions.restitution || 0.8,
                        isStatic: physicsOptions.isStatic,
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
                });
                M.Composite.add(this.engine.world, rect);
                break;
            default:
                throw Error('Unknown hull type!')
        }
    }

    destroyEntity(ev: DestroyEntity) {
        const body = this.getBody(ev.entityId);
        if (body) M.Composite.remove(this.engine.world, body);
    }
}

const physics = Physics.singleton;
export { physics };