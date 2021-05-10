import { makeEntity } from "../events/make_entity_helper.js";
import { Control } from "./control.js";
// Tap to trigger a CreateObject event for a new ball.
export class CreateBallControl extends Control {
    constructor() {
        super(...arguments);
        this.type = 'CREATE_BALL_CONTROL';
    }
    onDown(pos) {
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
