import { Pos, Vec, VPositions } from "../coords/coords.js";

const Colors = {
    BLACK: '#000',
    RED: '#FF9AA2',
    ORANGE: '#FFB7B2',
    GREEN: '#E2F0CB',
    BLUE: '#D4F0F0',
    PURPLE: '#C7CEEA',
}

export const DEBUG_COLOR = '#F00';
export const BG_COLOR = Colors.BLACK;
export const FG_COLOR = Colors.BLUE;

export interface Gfx {
    onViewportSizeChange(): void;

    clearAndSetTransform(): void;

    line(from: Pos, to: Pos, color?: string): void;

    vector(from: Pos, vec: Vec, color?: string): void;

    circle(center: Pos, radius: number, color?: string): void;

    linestrip(c: VPositions, color?: string): void;

    lineloop(c: VPositions, color?: string): void;

    filledpoly(c: VPositions, color?: string): void;

    text(p: Pos, s: string, color?: string): void;
}