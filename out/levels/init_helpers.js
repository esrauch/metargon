import { bus } from "../bus/bus.js";
import { allControls } from "../controls/controls.js";
import { Pos, VWIDTH, VHEIGHT } from "../coords/coords.js";
import { PositionedRect, Rect } from "../coords/rect.js";
import { ActivateControl } from "../events/activate_control_events.js";
import { makeEntity } from "../events/make_entity_helper.js";
import { Lose, Win } from "../events/win_loss_events.js";
import { Color, LINE_WIDTH } from "../gfx/gfx.js";
import { PLAYER } from "../payloads/entity_id.js";
import { Icon } from "../payloads/rendering_payload.js";
import { controlsSystem } from "../systems/controls_system.js";
import { getRotation } from "../systems/getters.js";
import { assertUnreachable } from "../util/assert.js";
export function initStaticBox(rect, text = '') {
    return makeEntity({
        label: 'box',
        initialPos: rect.center,
        rendering: {
            type: 'BOXED_TEXT',
            text,
            boxW: rect.w,
            boxH: rect.h,
            fontSize: 75,
        },
        physics: {
            hull: {
                type: 'RECT',
                width: rect.w,
                height: rect.h,
            },
            isStatic: true
        }
    });
}
export function initWinSensor(r) {
    return initSensor(r, () => bus.dispatch(new Win()), {
        color: Color.GRASS,
        text: { value: 'WIN', fontSize: 50 },
    });
}
export function initLoseSensor(r) {
    return initSensor(r, () => bus.dispatch(new Lose()), {
        color: Color.FIRE,
        text: { value: 'LOSE', fontSize: 50 },
    });
}
export function initSensor(r, callback, opts) {
    const renderingPayload = (opts === null || opts === void 0 ? void 0 : opts.text) ?
        {
            type: 'BOXED_TEXT',
            text: opts.text.value,
            boxW: r.w,
            boxH: r.h,
            fontSize: opts.text.fontSize,
            color: opts === null || opts === void 0 ? void 0 : opts.color,
        } :
        {
            type: 'RECT',
            width: r.w,
            height: r.h,
            color: opts === null || opts === void 0 ? void 0 : opts.color,
        };
    return makeEntity({
        label: 'sensor',
        initialPos: r.center,
        rendering: renderingPayload,
    }, {
        type: 'SENSOR',
        payload: {
            target: PLAYER,
            rect: new Rect(r.w, r.h),
            callback,
            triggerOnOutside: opts === null || opts === void 0 ? void 0 : opts.triggerOnOutside,
        }
    });
}
export function initPlayerEntity(pos) {
    return makeEntity({
        entityId: PLAYER,
        initialPos: pos || new Pos(200, 200),
        label: "player",
        rendering: {
            type: 'FUNCTION',
            fn: (gfx, id, center) => {
                gfx.fillcircle(center, 50);
                const angle = getRotation(id) || 0;
                const eye = new Pos(center.x + Math.cos(angle) * 20, center.y + Math.sin(angle) * 20);
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
export function initWorldBounds(showBounds = true) {
    // Build 4 walls around.
    function makeStaticBlock(label, x1, y1, x2, y2) {
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
    makeWorldBoundsEntity(showBounds);
}
export function makeWorldBoundsEntity(showBounds) {
    // Because we really want the box to be "outside" of the contained world, we have to
    // offset points by the line width.
    const hlw = LINE_WIDTH;
    const rect = PositionedRect.trbl(-hlw, VWIDTH + hlw, VHEIGHT + hlw, -hlw);
    const rendering = {
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
export const CONTROL_SIZE = 200;
function makeBoxedTextForControl(control) {
    let icon = undefined;
    let dispChar = undefined;
    switch (control) {
        case 'BALL':
            dispChar = 'O';
            break;
        case 'FLAPPY':
            dispChar = 'F';
            break;
        case 'GOLF':
            dispChar = 'G';
            break;
        case 'ROLL':
            icon = Icon.SPIN;
            break;
        case 'ARROW':
            dispChar = 'A';
            break;
        default: return assertUnreachable(control);
    }
    if (icon) {
        return {
            type: 'RENDERING',
            payload: {
                type: 'CONDITIONAL',
                cond: () => controlsSystem.getActiveControlName() === control,
                ifTrue: {
                    type: 'ICON',
                    icon: Icon.SPIN,
                    w: CONTROL_SIZE,
                    color: Color.FG,
                },
                ifFalse: {
                    type: 'ICON',
                    icon: Icon.SPIN,
                    w: CONTROL_SIZE,
                    color: Color.BG_MILD,
                }
            }
        };
    }
    else {
        return {
            type: 'RENDERING',
            payload: {
                type: 'CONDITIONAL',
                cond: () => controlsSystem.getActiveControlName() === control,
                ifTrue: {
                    type: 'BOXED_TEXT',
                    text: dispChar !== null && dispChar !== void 0 ? dispChar : '?',
                    boxW: CONTROL_SIZE,
                    boxH: CONTROL_SIZE,
                    fontSize: CONTROL_SIZE,
                    color: Color.FG,
                },
                ifFalse: {
                    type: 'BOXED_TEXT',
                    text: dispChar !== null && dispChar !== void 0 ? dispChar : '?',
                    boxW: CONTROL_SIZE,
                    boxH: CONTROL_SIZE,
                    fontSize: CONTROL_SIZE,
                    color: Color.BG_MILD,
                }
            }
        };
    }
}
export function initControlsWidget(controls = allControls, initialActive) {
    const w = CONTROL_SIZE;
    const h = CONTROL_SIZE;
    function makeControlsWidget(control, x) {
        makeEntity({
            label: 'controls_widget_' + control,
            initialPos: new Pos(x, h / 2)
        }, makeBoxedTextForControl(control), {
            type: 'HITTEST',
            payload: {
                w, h,
                callback: () => bus.dispatch(new ActivateControl(control)),
            }
        });
    }
    for (let i = 0; i < controls.length; ++i) {
        const x = VWIDTH / 2 + ((i + 0.5) - controls.length / 2) * CONTROL_SIZE;
        makeControlsWidget(controls[i], x);
    }
    bus.dispatch(new ActivateControl(initialActive));
}
export function initResetButton() {
    const resetBtnRect = PositionedRect.trbl(0, CONTROL_SIZE, CONTROL_SIZE, 0);
    return makeEntity({
        label: 'controls_widget',
        initialPos: resetBtnRect.center,
    }, {
        type: 'RENDERING',
        payload: {
            type: 'BOXED_TEXT',
            boxW: CONTROL_SIZE,
            boxH: CONTROL_SIZE,
            text: 'X',
            fontSize: CONTROL_SIZE,
        }
    }, {
        type: 'HITTEST',
        payload: {
            w: CONTROL_SIZE, h: CONTROL_SIZE,
            callback: () => bus.dispatch(new Lose()),
        }
    });
}
