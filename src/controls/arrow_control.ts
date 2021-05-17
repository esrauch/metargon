import { Pos, Vec } from "../coords/coords.js";
import { Control } from "./control.js";
import { VectorControl } from "./vector_control.js";


export class ArrowControl extends VectorControl {
    onVectorUpdate(pos: Pos, vec: Vec): void {
    }
    onVectorRelease(pos: Pos, vec: Vec): void {
    }
    onVectorCancel(): void {
    }
    
}