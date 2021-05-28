

import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT, pos } from "../../coords/coords.js";
import { PositionedRect, Rect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Lose } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { Id, PLAYER } from "../../payloads/entity_id.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { initPlayerEntity, initWorldBounds, initStaticBox, initWinSensor, initControls } from "../init_helpers.js";
import { Level } from "../level.js";

function dispatchLose() { bus.dispatch(new Lose()) }

function makeLoseBall(x: number, y: number) {
    const r = 50;
    makeEntity({
        label: 'lose_ball',
        initialPos: pos(x, y),
        rendering: {
            type: 'CIRCLE',
            radius: r,
            color: Color.FIRE,
        },
        physics:  {
            hull: {
                type: 'CIRCLE',
                radius: r,
            },
            entityCategory: PhysicsEntityCategory.NO_COLLIDE_WITH_PLAYER,
        }
    }, {
        type: 'SENSOR',
        payload: {
            target: PLAYER,
            rect: new Rect(3*r, 3*r),
            callback: dispatchLose,
        }
    })
}

function makeWhiteBall(x: number, y: number) {
    const r = 75;
    makeEntity({
        label: 'blue_ball',
        initialPos: pos(x, y),
        rendering: {
            type: 'CIRCLE',
            radius: r,
        },
        physics:  {
            hull: {
                type: 'CIRCLE',
                radius: r,
            },
        }
    });
}

export class Level02 implements Level {
    activate(): void {
        initPlayerEntity(new Pos(100, VHEIGHT*3/4));
        initWorldBounds(/* showWorldBounds */ false);
        initControls('ROLL');

        const staticBox = initStaticBox(
            new PositionedRect(new Pos(VWIDTH/2, VHEIGHT*3/4 + 25), VWIDTH, 100));
        bus.dispatch(new ChangePhysicsEntityCategory(staticBox, PhysicsEntityCategory.COLLIDE_ONLY_WITH_PLAYER));
        initWinSensor(new PositionedRect(new Pos(VWIDTH-125, VHEIGHT*3/4-125), 250, 250));

        initStaticBox(
            new PositionedRect(new Pos(VWIDTH/4, 1100), 1450, 50), {
                rotation: Math.PI / 2.7,
            });
        initStaticBox(
            new PositionedRect(new Pos(VWIDTH*3/4, 1100), 1450, 50), {
                rotation: 2*Math.PI - (Math.PI/2.7),
            });
        initStaticBox(PositionedRect.trbl(400, 1800, 500, 200));

        for (let i = 0; i < 20; ++i)
            makeLoseBall(i * 50, VHEIGHT-600);

        for (let i = 0; i < 10; ++i)
            makeWhiteBall(i * 50, VHEIGHT-400);

        const moveToTopSensor = PositionedRect.trbl(VHEIGHT-400, VWIDTH,VHEIGHT,0);
        makeEntity({
            label: 'moveToTopSensor',
            initialPos: moveToTopSensor.center,
        }, {
            type: 'SENSOR',
            payload: {
                target: undefined,
                rect: moveToTopSensor.unpositionedRect,
                triggerMultipleTimes: true,
                instantActivate: true,
                callback: (id: Id) => {
                    bus.dispatch(new SetPayloadEvent(id, {
                        type: 'POSITION',
                        payload: new Pos(VWIDTH/2, 800)
                    }))
                }
            }
        });
    }
}