import { genericPayloadTable } from "./generic_payload_table.js";
import { physics } from "./physics/physics.js";
import { renderer } from "./rendering/renderer.js";
const allSystems = [
    physics,
    genericPayloadTable,
    renderer,
];
export function resetAllSystems() {
    allSystems.forEach(system => system.reset());
}
export { allSystems };
