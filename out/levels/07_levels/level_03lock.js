import { DelayedDestroy, DelayedEntitySpecificCallback, DelayedSetPayload } from "../../anim/delayed_callback.js";
import { UpdateRenderingAnim } from "../../anim/update_rendering_anim.js";
import { bus } from "../../bus/bus.js";
import { Pos, VWIDTH, VHEIGHT } from "../../coords/coords.js";
import { PositionedRect } from "../../coords/rect.js";
import { makeEntity } from "../../events/make_entity_helper.js";
import { SetPayloadEvent } from "../../events/payload_events.js";
import { ChangePhysicsEntityCategory } from "../../events/physics_events.js";
import { Win } from "../../events/win_loss_events.js";
import { Color } from "../../gfx/gfx.js";
import { PhysicsEntityCategory } from "../../payloads/physics_payload.js";
import { animationSystem } from "../../systems/animation_system.js";
import { initPlayerEntity, initWorldBounds, initLoseSensor, initControls } from "../init_helpers.js";
const horizReleaseTime = 5;
const horizBlockPos = PositionedRect.trbl(500, VWIDTH - 50, 600, 50);
function updateCountdownRendering(tickCount) {
    const s = horizReleaseTime - Math.round(tickCount / 60);
    return {
        type: 'BOXED_TEXT',
        boxW: horizBlockPos.w,
        boxH: horizBlockPos.h,
        text: `OH NO... ${s}`,
        fontSize: 75,
        color: Color.WATER,
    };
}
const vertReleaseTime = 7;
const vertBlockPos = PositionedRect.trbl(0, 1600, 2000, 1200);
function updateCountdownRenderingSmall(tickCount) {
    const s = vertReleaseTime - Math.round(tickCount / 60);
    return {
        type: 'BOXED_TEXT',
        boxW: vertBlockPos.w,
        boxH: vertBlockPos.h,
        text: `${s}`,
        fontSize: 75,
    };
}
const targetRect = PositionedRect.trbl(500, VWIDTH, 1200, 1600);
export class Level03Lock {
    activate() {
        initPlayerEntity(new Pos(VWIDTH / 2, 250));
        initWorldBounds(/* showWorldBounds */ false);
        initControls('LOCK');
        const vertBlock = makeEntity({
            label: 'vert',
            initialPos: vertBlockPos.center,
            physics: {
                hull: {
                    type: 'RECT',
                    width: vertBlockPos.w,
                    height: vertBlockPos.h,
                },
                isStatic: true,
                entityCategory: PhysicsEntityCategory.COLLIDE_ONLY_WITH_PLAYER,
            }
        });
        animationSystem.start(new UpdateRenderingAnim(vertBlock, updateCountdownRenderingSmall, 60));
        const horizBlockPhysics = {
            hull: {
                type: 'RECT',
                width: horizBlockPos.w,
                height: horizBlockPos.h,
            },
            isStatic: true,
            entityCategory: PhysicsEntityCategory.MAGNETIC,
        };
        const horizBlock = makeEntity({
            label: 'holderupper',
            initialPos: horizBlockPos.center,
            physics: horizBlockPhysics,
        });
        animationSystem.start(new UpdateRenderingAnim(horizBlock, updateCountdownRendering, 60));
        animationSystem.start(new DelayedSetPayload(horizBlock, {
            type: 'PHYSICS',
            payload: Object.assign(Object.assign({}, horizBlockPhysics), { isStatic: false })
        }, horizReleaseTime * 60));
        animationSystem.start(new DelayedDestroy(vertBlock, vertReleaseTime * 60));
        this.shotTarget = makeEntity({
            label: 'shot_target',
            initialPos: targetRect.center,
            rendering: {
                type: 'BOXED_TEXT',
                boxW: targetRect.w,
                boxH: targetRect.h,
                fontSize: 50,
                text: 'SHOOT ME',
                color: Color.GRASS,
            }
        });
        initLoseSensor(PositionedRect.trbl(VHEIGHT - 250, VWIDTH, VHEIGHT, 0));
        bus.addListener(this);
    }
    deactivate() {
        bus.removeListener(this);
    }
    onEvent(ev) {
        switch (ev.type) {
            case 'CREATE_ENTITY':
                this.onCreateEntity(ev);
                break;
        }
    }
    onCreateEntity(ev) {
        if (ev.corePayload.payload.label === 'shot') {
            bus.dispatch(new SetPayloadEvent(ev.entityId, {
                type: 'SENSOR',
                payload: {
                    target: this.shotTarget,
                    rect: { w: targetRect.w, h: targetRect.h },
                    callback: () => bus.dispatch(new Win())
                }
            }));
            // HACK ON TOP OF HACK!        
            // Only for this level we make the shot be type=PLAYER so that we can
            // have a vertical box that is collide_except_player that blocks player+shot but
            // permits a vertical box to fall.
            // In addition, this callback might be called _before_ physics handles the createvent
            // and ChangePhsicsEntityCategory only works post-creation (unlike most payloads)
            // so we also change the type _next_ frame
            animationSystem.start(new DelayedEntitySpecificCallback(ev.entityId, () => {
                bus.dispatch(new ChangePhysicsEntityCategory(ev.entityId, PhysicsEntityCategory.PLAYER));
            }, 1));
        }
    }
}
