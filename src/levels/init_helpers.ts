import { bus } from "../bus/bus.js";
import { allControls, ControlName } from "../controls/controls.js";
import { Pos, VWIDTH, VHEIGHT } from "../coords/coords.js";
import { PositionedRect, Rect } from "../coords/rect.js";
import { ActivateControl } from "../events/activate_control_events.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { Lose, Win } from "../events/win_loss_events.js";
import { Color, LINE_WIDTH } from "../gfx/gfx.js";
import { Id, PLAYER } from "../payloads/entity_id.js";
import { PhysicsEntityCategory } from "../payloads/physics_payload.js";
import { Icon, RenderingPayload, RenderingTypedPayload } from "../payloads/rendering_payload.js";
import { controlsSystem } from "../systems/controls_system.js";
import { getRotation } from "../systems/getters.js";
import { assertUnreachable } from "../util/assert.js";

export function initNonRotatingBox(rect: PositionedRect, color?: Color): Id {
    return makeEntity({
        label: 'box',
        initialPos: rect.center,
        rendering:{
            type: 'RECT',
            width: rect.w,
            height: rect.h,
            filled: true,
            color,
        },
        physics: {
            hull: {
                type: 'RECT',
                width: rect.w,
                height: rect.h,
            },
            nonRotating: true,
        }
    });    
}

export function initStaticBox(rect: PositionedRect, opts?: {
    text?: string
    rotation?: number,
}): Id {
    const text = opts?.text;
    let rendering: RenderingPayload;
    if (text) {
        rendering = {
            type: 'BOXED_TEXT',
            text,
            boxW: rect.w,
            boxH: rect.h,
            fontSize: 75,
        };
    } else if (opts?.rotation) {
        rendering = {type: 'PHYSICS_HULL'};
    } else {
        rendering = {
            type: 'RECT',
            width: rect.w,
            height: rect.h,
            filled: true,
        }
    }

    return makeEntity({
        label: 'box',
        initialPos: rect.center,
        rendering,
        physics: {
            hull: {
                type: 'RECT',
                width: rect.w,
                height: rect.h,
            },
            rotation: opts?.rotation,
            isStatic: true
        }
    });
}


export function initWinSensor(r: PositionedRect): Id {
    return initSensor(r, () => bus.dispatch(new Win()), {
        color: Color.GRASS,
    })
}

export function initLoseSensor(r: PositionedRect): Id {
    return initSensor(r, () => bus.dispatch(new Lose()), {
        color: Color.FIRE,
    })
}

export function initSensor(r: PositionedRect,
    callback: () => void, opts?: {
        color?: string,
        triggerOnOutside?: boolean,
        triggerOnAny?: boolean,
        text?: {value: string, fontSize: number},
    }): Id {
    const renderingPayload: RenderingPayload = opts?.text ?
        {
            type: 'BOXED_TEXT',
            text: opts.text.value,
            boxW: r.w,
            boxH: r.h,
            fontSize: opts.text.fontSize,
            color: opts?.color,
        } :
        {
            type: 'RECT',
            width: r.w,
            height: r.h,
            color: opts?.color,
            filled: true,
        };

    return makeEntity({
        label: 'sensor',
        initialPos: r.center,
        rendering: renderingPayload,
    }, {
        type: 'SENSOR',
        payload: {
            target: opts?.triggerOnAny ? undefined : PLAYER,
            rect: new Rect(r.w, r.h),
            callback,
            triggerOnOutside: opts?.triggerOnOutside,
        }
    });
}


export function initPlayerEntity(pos: Pos, opts?: {
    color?: Color,
    isStatic?: boolean,
    entityCategory?: PhysicsEntityCategory,
}): Id {
    return makeEntity({
        entityId: PLAYER,
        initialPos: pos || new Pos(200, 200),
        label: "player",
        rendering: {
            type: 'FUNCTION',
            fn: (gfx, id, center) => {
                gfx.circle(center, 50, opts?.color);
                const angle = getRotation(id) || 0;
                const eye =
                    new Pos(
                        center.x + Math.cos(angle) * 20,
                        center.y + Math.sin(angle) * 20);

                gfx.circle(eye, 20, '#000');

            }
        },
        physics: {
            hull: {
                type: 'CIRCLE',
                radius: 50,
            },
            isStatic: opts?.isStatic,
            entityCategory: opts?.entityCategory ?? PhysicsEntityCategory.PLAYER,
        }
    });
}

export function initWorldBounds(showBounds: boolean = true, skipBlockOnTop?: boolean) {
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
    if (!skipBlockOnTop) makeStaticBlock("top", L - D, T - D, R + D, T);
    makeStaticBlock("bottom", L - D, B, R + D, B + D);

    makeWorldBoundsEntity(showBounds);
}

export function makeWorldBoundsEntity(showBounds: boolean) {
    // Because we really want the box to be "outside" of the contained world, we have to
    // offset points by the line width.
    const hlw = LINE_WIDTH;
    const rect = PositionedRect.trbl(-hlw, VWIDTH+hlw, VHEIGHT+hlw, -hlw)
    const rendering: RenderingPayload = {
        type: 'RECT',
        width: rect.w,
        height: rect.h,
    };
    makeEntity({
        initialPos: rect.center,
        label: 'world',
        rendering: showBounds ? rendering : undefined
    }, {
        type: 'SENSOR',
        payload: {
            target: PLAYER,
            rect: new Rect(rect.w, rect.h),
            callback: () => bus.dispatch(new Lose()),
            triggerOnOutside: true,
        }
    });
}

export const CONTROL_SIZE = 250;

function makeBoxedTextForControl(control: ControlName): RenderingTypedPayload {
    return {
        type: 'RENDERING',
        payload: {
            type: 'CONDITIONAL',
            cond: () => controlsSystem.getActiveControlName() === control,
            ifTrue: {
                type: 'BOXED_TEXT',
                text: control,
                boxW: CONTROL_SIZE,
                boxH: CONTROL_SIZE,
                fontSize: 65,
                color: Color.FG,
            },
            ifFalse:{
                type: 'BOXED_TEXT',
                text: control,
                boxW: CONTROL_SIZE,
                boxH: CONTROL_SIZE,
                fontSize: 65,
                color: Color.BG_MILD,
            }
        }
    };
}

export function initControl(control: ControlName) {
    initControlsWidget([control], control);
}

export function initControls(
    initialActive?: ControlName,
    controls ?: ControlName[],
) {
    // Just opposite arg order, lol.
    initControlsWidget(controls, initialActive);
}

export function initControlsWidget(
        controls: ControlName[] = ['ROLL', 'FLAP', 'SHOT', 'MAG', 'LOCK'],
        initialActive?: ControlName) {
    const w = CONTROL_SIZE;
    const h = CONTROL_SIZE;

    function makeControlsWidget(control: ControlName, x: number) {
        makeEntity({
            label: 'controls_widget_' + control,
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

    for (let i = 0; i < controls.length; ++i) {
        const x = VWIDTH / 2 + ((i + 0.5) - controls.length/2) * CONTROL_SIZE;
        makeControlsWidget(controls[i], x);
    }

    bus.dispatch(new ActivateControl(initialActive));
}

export function initResetButton(): Id {
    const resetBtnRect = PositionedRect.trbl(0, CONTROL_SIZE, CONTROL_SIZE, 0);
    return makeEntity({
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