import { SPos } from "../coords/coords.js";
import { AbstractPointerEvtControl } from "./pointer_helper.js";
import { camera } from "../coords/camera.js";
import { makeEntity } from "../bus/events/make_entity_helper.js";

// Tap to trigger a CreateObject event for a new ball.
export class CreateBallControl extends AbstractPointerEvtControl {
    onDown(ev: PointerEvent): void {
        const initialPos = camera.toVirtualPos(new SPos(ev.x, ev.y));
        if (!initialPos.isInBounds()) {
            console.error('discarding createBall since its OOB');
            return;
        }
        makeEntity({
            initialPos,
            label: "ball",
            renderingData: {
                type: 'CIRCLE',
                radius: 50,
            },
            physicsData: {
                hull: {
                    type: 'CIRCLE',
                    radius: 50,
                }
            }
        });
    }
    onMove(ev: PointerEvent): void {
    }
    onUp(ev: PointerEvent): void {
    }
    onCancel(ev: PointerEvent): void {
    }
}