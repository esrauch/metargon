/// <reference types="./matter" />

import { ApplyForceEvent, EnablePhysics, SetVelocityEvent } from "../bus/events/physics.js";
import { bus, BusEvent, BusListener } from "../bus/bus.js";
import { VHEIGHT, VWIDTH, VPositions, SVec, Vec, Pos } from "../coords/coords.js";
import { DrawEvent } from "../bus/events/draw.js";
import { CreateEntityEvent } from "../bus/events/create_entity.js";
import { Id, makeEntityId } from "../entity/entity_id.js";
import { DestroyEntityEvent } from "../bus/events/destroy_entity.js";
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
    private ball?: Matter.Body;

    static singleton = new Physics();

    private constructor() {
        const engine = this.engine = M.Engine.create({
            gravity: {
                y: 5,
            }
        });

        // The entire world is [0-2000] x [0-3000]
        // Box in that world with boxes of aribitrary size D
        // We double-cover the corners with this.
        // const [T, R, B, L] = [0, VWIDTH, VHEIGHT, 0];
        // const D = 500;
        // const left = makeStaticBlock("left", L - D, T - D, L, B + D);
        // const right = makeStaticBlock("right", R, T - D, R + D, B + D);
        // const top = makeStaticBlock("top", L - D, T - D, R + D, T);
        // const bottom = makeStaticBlock("bottom", L - D, B, R + D, B + D);
        // M.Composite.add(engine.world, [left, right, top, bottom]);
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

    
    private setVelocity(ev: SetVelocityEvent) {
        if (!this.ball) return;
        const vec = ev.newVelocity;
        const arbitraryNerf = 1 / 5;
        const fx = vec.dx * arbitraryNerf;
        const fy = vec.dy * arbitraryNerf;
        M.Body.setVelocity(
            this.ball,
            M.Vector.create(fx, fy)
        );
    }

    private applyForce(ev: ApplyForceEvent) {
        if (!this.ball) return;
        const vec = ev.force;
        const arbitraryNerf = 1 / 200;
        const fx = vec.dx * arbitraryNerf;
        const fy = vec.dy * arbitraryNerf;
        M.Body.applyForce(
            this.ball,
            this.ball.position,
            M.Vector.create(fx, fy));
    }

    private enablePhysics(ev: EnablePhysics) {
        const physicsOptions = ev.physicsData;
        if (!physicsOptions) return;
        const id = ev.entityId;
        const initialPos = getCenterPosition(id);
        const label = labelTable.getLabel(id)

        const hull = physicsOptions.hull;
        if (hull.type == 'CIRCLE') {
            const ball = M.Bodies.circle(initialPos.x, initialPos.y, hull.radius,
                {
                    id: id,
                    label: label,
                    // TODO: this precludes 0
                    restitution: physicsOptions.restitution || 0.8,
                    isStatic: physicsOptions.static,
                });
            M.Composite.add(this.engine.world, ball);
            if (!this.ball) this.ball = ball;
        } else if (hull.type == 'RECT') {
            const rect = M.Bodies.rectangle(
                initialPos.x, initialPos.y, hull.width, hull.height, {
                id: id,
                label: label,
                restitution: physicsOptions.restitution || 0.8,
                isStatic: physicsOptions.static,
            });
            M.Composite.add(this.engine.world, rect);
        } else {
            throw Error('Unknown hull type!')
        }
    }

    destroyEntity(ev: DestroyEntityEvent) {
        const body = this.getBody(ev.entityId);
        if (body) M.Composite.remove(this.engine.world, body);
    }
}

const physics = Physics.singleton;
export { physics };