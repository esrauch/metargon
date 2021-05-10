import { coreTable } from "./core_table.js"
import { genericPayloadTable } from "./generic_payload_table.js"
import { physics } from "./physics/physics.js"
import { renderer } from "./rendering/renderer.js"

const allSystems = [
    physics,
    coreTable,
    genericPayloadTable,
    renderer,
]
export {allSystems}