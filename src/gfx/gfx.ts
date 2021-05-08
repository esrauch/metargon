import { Pos, Vec, Positions } from "../coords/coords.js";

const Colors = {
    BLACK: '#000',
    RED: '#FF9AA2',
    ORANGE: '#FFB7B2',
    GREEN: '#E2F0CB',
    BLUE: '#D4F0F0',
    PURPLE: '#C7CEEA',
    WHITE: '#FFF',
}

export const DEBUG_COLOR = '#F00';
export const BG_COLOR = Colors.BLACK;
export const FG_COLOR = Colors.WHITE;

export interface Gfx {
    onViewportSizeChange(): void;

    clearAndSetTransform(): void;

    setGlobalOpacity(opacity: number): void;

    line(from: Pos, to: Pos, color?: string): void;

    vector(from: Pos, vec: Vec, color?: string): void;

    circle(center: Pos, radius: number, color?: string): void;

    linestrip(c: Positions, color?: string): void;

    lineloop(c: Positions, color?: string): void;

    filledpoly(c: Positions, color?: string): void;

    text(p: Pos, s: string, opts?: {
        color?: string,
        size?: number,
        font?: string,
    }): void;
}