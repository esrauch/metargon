import { controlsSystem } from "./controls_system.js";
import { genericPayloadTable } from "./generic_payload_table.js";
import { levelSystem } from "./level_system.js";
import { physics } from "./physics/physics.js";
import { renderer } from "./rendering/renderer.js";
import { sensorSystem } from "./sensor_system.js";
import { statsSystem } from "./stats_system.js";
const allSystems = [
    statsSystem,
    controlsSystem,
    physics,
    genericPayloadTable,
    renderer,
    sensorSystem,
    levelSystem,
];
export { allSystems };
