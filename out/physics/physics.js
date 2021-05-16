/// <reference types="./matter" />
import { Pos, VHEIGHT, Positions } from "../coords/coords.js";
import { labelTable } from "../entity/label_table.js";
import { getCenterPosition } from "../util/get_position.js";
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
    enablePhysics(ev) {
        const physicsOptions = ev.physicsData;
        if (!physicsOptions)
            return;
        const id = ev.entityId;
        const initialPos = getCenterPosition(id);
        const label = labelTable.getLabel(id);
        const hull = physicsOptions.hull;
        switch (hull.type) {
            case 'CIRCLE':
                const ball = M.Bodies.circle(initialPos.x, initialPos.y, hull.radius, {
                    id,
                    label,
                    // TODO: this precludes 0
                    restitution: physicsOptions.restitution || 0.8,
                    isStatic: physicsOptions.static,
                });
                M.Composite.add(this.engine.world, ball);
                break;
            case 'RECT':
                const rect = M.Bodies.rectangle(initialPos.x, initialPos.y, hull.width, hull.height, {
                    id,
                    label,
                    restitution: physicsOptions.restitution || 0.8,
                    isStatic: physicsOptions.static,
                });
                M.Composite.add(this.engine.world, rect);
                break;
            default:
                return assertUnreachable(hull.type);
        }
    }
    destroyEntity(ev) {
        const body = this.getBody(ev.entityId);
        if (body)
            M.Composite.remove(this.engine.world, body);
    }
}
Physics.singleton = new Physics();
const physics = Physics.singleton;
export { physics };
