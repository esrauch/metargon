import { bus } from "../bus/bus.js";
import { SPos } from "../coords/coords.js";
import { AbstractPointerEvtControl } from "./pointer_helper.js";
import { CreateEntityEvent } from "../bus/events/create_entity.js";
import { camera } from "../coords/camera.js";

// Tap to trigger a CreateObject event for a new ball.
export class CreateBallControl extends AbstractPointerEvtControl {
    onDown(ev: PointerEvent): void {
        const initial_pos = camera.toVirtualPos(new SPos(ev.x, ev.y));
        bus.dispatch(CreateEntityEvent.create({
            initial_pos,
            label: "ball",
            rendering_data: {
                type: 'CIRCLE',
                radius: 50,
            },
            physics: {
                hull: {
                    type: 'CIRCLE',
                    radius: 50,
                }
            }
        }));
    }
    onMove(ev: PointerEvent): void {
    }
    onUp(ev: PointerEvent): void {
    }
    onCancel(ev: PointerEvent): void {
    }
}