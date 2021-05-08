/// <reference types="./matter" />

import { ApplyForce, EnablePhysics, SetVelocity } from "../bus/events/physics.js";
import { BusEvent, BusListener } from "../bus/bus.js";
import { VPositions, Pos, VHEIGHT } from "../coords/coords.js";
import { DrawEvent } from "../bus/events/draw.js";
import { DestroyEntity } from "../bus/events/core_entity_events.js";
import { Id, makeEntityId } from "../entity/entity_id.js";
import { labelTable } from "../entity/label_table.js";
import { getCenterPosition } from "../util/get_position.js";

// Importing a js module with typings is incredibly difficult for some reason.
// Matter should be loaded as a module, but instead we just
// load it into the global namespace in index.html.
const M = window.Matter;

const STEP = 1000 / 60;

function makeStaticBlock(
    label: string,
    x1: number, y1: number, x2: number, y2: number) {
    // Matter rectangle() does x/y based on _center_ for some reason
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);
    const x = Math.min(x1, x2) + w / 2;
    const y = Math.min(y1, y2) + h / 2;
    return M.Bodies.rectangle(
        x, y, w, h, { isStatic: true, label, id: makeEntityId() }
    );
}

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
            case 'ENABLE_PHYSICS':
                this.enablePhysics(ev);
                break;
            case 'DESTROY_ENTITY':
                this.destroyEntity(ev);
                break;
        }
    }

    private tick() {
        M.Engine.update(this.engine, STEP);
    }

    private draw(ev: DrawEvent) {
        if (this.debugUi.renderHulls) {
            for (const b of M.Composite.allBodies(this.engine.world)) {
                ev.gfx.lineloop(
                    new VPositions(b.vertices.map(v => [v.x, v.y]))
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

    private enablePhysics(ev: EnablePhysics) {
        const physicsOptions = ev.physicsData;
        if (!physicsOptions) return;
        const id = ev.entityId;
        const initialPos = getCenterPosition(id);
        const label = labelTable.getLabel(id)

        const hull = physicsOptions.hull;
        switch (hull.type) {
            case 'CIRCLE':
                const ball = M.Bodies.circle(initialPos.x, initialPos.y, hull.radius,
                    {
                        id,
                        label,
                        // TODO: this precludes 0
                        restitution: physicsOptions.restitution || 0.8,
                        isStatic: physicsOptions.static,
                    });
                M.Composite.add(this.engine.world, ball);
                break;
            case 'RECT':
                const rect = M.Bodies.rectangle(
                    initialPos.x, initialPos.y, hull.width, hull.height, {
                    id,
                    label,
                    restitution: physicsOptions.restitution || 0.8,
                    isStatic: physicsOptions.static,
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