import { controlsSystem } from "./controls_system.js";
import { genericPayloadTable } from "./generic_payload_table.js"
import { physics } from "./physics/physics.js"
import { renderer } from "./rendering/renderer.js"
import { screenSystem } from "./screen_system.js";
import { sensorSystem } from "./sensor_system.js";

const allSystems = [
    controlsSystem,
    physics,
    genericPayloadTable,
    renderer,
    sensorSystem,
    screenSystem,
];

export {allSystems}