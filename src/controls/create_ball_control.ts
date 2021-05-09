import { Pos, SPos } from "../coords/coords.js";
import { PointerEvtControl } from "./pointer_helper.js";
import { camera } from "../coords/camera.js";
import { makeEntity } from "../events/make_entity_helper.js";

// Tap to trigger a CreateObject event for a new ball.
export class CreateBallControl extends PointerEvtControl {
    onDown(pos: Pos): void {
        const initialPos = pos;
        if (!initialPos.isInBounds()) {
            console.error('discarding createBall since its OOB');
            return;
        }
        makeEntity({
            initialPos,
            label: "ball",
            rendering: {
                type: 'CIRCLE',
                radius: 50,
            },
            physics: {
                hull: {
                    type: 'CIRCLE',
                    radius: 50,
                }
            }
        });
    }
}