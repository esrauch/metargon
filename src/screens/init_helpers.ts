import { bus } from "../bus/bus.js";
import { ControlName } from "../controls/controls.js";
import { Pos, VWIDTH, VHEIGHT } from "../coords/coords.js";
import { PositionedRect, Rect } from "../coords/rect.js";
import { ActivateControl } from "../events/activate_control_events.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { Lose } from "../events/win_loss_events.js";
import { Color, LINE_WIDTH } from "../gfx/gfx.js";
import { PLAYER } from "../payloads/entity_id.js";
import { RenderingTypedPayload } from "../payloads/rendering_payload.js";
import { controlsSystem } from "../systems/controls_system.js";
import { getRotation } from "../systems/getters.js";

export function initSensor(r: PositionedRect,
    callback: () => void, opts?: {
        color?: string,
        triggerOnOutside?: boolean,
    }) {
    return makeEntity({
        label: 'sensor',
        initialPos: r.center,
        rendering: {
            type: 'RECT',
            width: r.w,
            height: r.h,
            color: opts?.color,
        },
    }, {
        type: 'SENSOR',
        payload: {
            target: PLAYER,
            rect: new Rect(r.w, r.h),
            callback,
            triggerOnOutside: opts?.triggerOnOutside,
        }
    });
}


export function initPlayerEntity(pos?: Pos) {
    return makeEntity({
        entityId: PLAYER,
        initialPos: pos || new Pos(200, 200),
        label: "player",
        rendering: {
            type: 'FUNCTION',
            fn: (gfx, id, center) => {
                gfx.fillcircle(center, 50);
                const angle = getRotation(id) || 0;
                const eye =
                    new Pos(
                        center.x + Math.cos(angle) * 20,
                        center.y + Math.sin(angle) * 20);

                gfx.fillcircle(eye, 20, '#000');

            }
        },
        physics: {
            hull: {
                type: 'CIRCLE',
                radius: 50,
            }
        }
    });
}

export function initWorldBounds() {
    // Build 4 walls around.
    function makeStaticBlock(
        label: string,
        x1: number, y1: number, x2: number, y2: number) {
        // Matter rectangle() does x/y based on _center_ for some reason
        const w = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);
        const x = Math.min(x1, x2) + w / 2;
        const y = Math.min(y1, y2) + h / 2;
        const initialPos = new Pos(x, y);

        makeEntity({
            initialPos,
            label,
            physics: {
                hull: {
                    type: 'RECT',
                    width: w,
                    height: h,
                },
                isStatic: true
            }
        });
    }

    // The entire world is [0-2000] x [0-3000]
    // Box in that world with boxes of aribitrary size D
    // We double-cover the corners with this.
    const [T, R, B, L] = [0, VWIDTH, VHEIGHT, 0];
    const D = 500;

    // Invisible physics-only blocks surrounding the world.
    makeStaticBlock("left", L - D, T - D, L, B + D);
    makeStaticBlock("right", R, T - D, R + D, B + D);
    makeStaticBlock("top", L - D, T - D, R + D, T);
    makeStaticBlock("bottom", L - D, B, R + D, B + D);

    makeWorldBoundsEntity();
}

export function makeWorldBoundsEntity() {
    // Because we really want the box to be "outside" of the contained world, we have to
    // offset points by the line width.
    const hlw = LINE_WIDTH;
    const [T, R, B, L] = [-hlw, VWIDTH+hlw, VHEIGHT+hlw, -hlw];
    /*
    return makeEntity({
        label: 'worldbounds',
        initialPos: new Pos(0, 0),
        rendering: {
            type: 'LINELOOP',
            pts: new Positions([
                [L, T],
                [R, T],
                [R, B],
                [L, B]
            ])
        }
    });*/

    initSensor(
        PositionedRect.fromBounds(-hlw, VWIDTH+hlw, VHEIGHT+hlw, -hlw),
        () => bus.dispatch(new Lose()),
        { triggerOnOutside: true});
}

function makeBoxedTextForControl(control: ControlName): RenderingTypedPayload {
    let dispChar = '?';
    switch (control) {
        case 'BALL': dispChar = 'O'; break;
        case 'FLAPPY': dispChar = 'F'; break;
        case 'GOLF_FORCE': dispChar = 'G'; break;
        case 'GOLF_VELOCITY': dispChar = 'V'; break;
        case 'ROLL': dispChar = 'R'; break;
    }
    return {
        type: 'RENDERING',
        payload: {
            type: 'CONDITIONAL',
            cond: () => controlsSystem.getActiveControlName() === control,
            ifTrue: {
                type: 'BOXED_TEXT',
                text: dispChar,
                boxW: CONTROL_SIZE,
                boxH: CONTROL_SIZE,
                fontSize: CONTROL_SIZE,
                color: Color.FG,
            },
            ifFalse:{
                type: 'BOXED_TEXT',
                text: dispChar,
                boxW: CONTROL_SIZE,
                boxH: CONTROL_SIZE,
                fontSize: CONTROL_SIZE,
                color: Color.BG_MILD,
            }
        }
    }
}

export const CONTROL_SIZE = 200;
export function initControlsWidget() {
    const w = CONTROL_SIZE;
    const h = CONTROL_SIZE;

    function makeControlsWidget(control: ControlName, x: number) {
        makeEntity({
            label: 'controls_widget',
            initialPos: new Pos(x, h / 2)
        },
            makeBoxedTextForControl(control),
            {
                type: 'HITTEST',
                payload: {
                    w, h,
                    callback: () => bus.dispatch(new ActivateControl(control)),
                }
            }
        );
    }
    makeControlsWidget('GOLF_FORCE', VWIDTH / 2 - w * 2)
    makeControlsWidget('GOLF_VELOCITY', VWIDTH / 2 - w)
    makeControlsWidget('FLAPPY', VWIDTH / 2 + w)
    makeControlsWidget('BALL', VWIDTH / 2 + w * 2)
    makeControlsWidget('ROLL', VWIDTH / 2);

    const resetBtnRect = PositionedRect.fromBounds(0, CONTROL_SIZE, CONTROL_SIZE, 0);
    makeEntity({
        label: 'controls_widget',
        initialPos: resetBtnRect.center,
    },
        {
            type: 'RENDERING',
            payload: {
                type: 'BOXED_TEXT',
                boxW: CONTROL_SIZE,
                boxH: CONTROL_SIZE,
                text: 'X',
                fontSize: CONTROL_SIZE,
            }
        },
        {
            type: 'HITTEST',
            payload: {
                w: CONTROL_SIZE, h: CONTROL_SIZE,
                callback: () => bus.dispatch(new Lose()),
            }
        });
}