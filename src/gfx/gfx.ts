import { Pos, Vec, Positions } from "../coords/coords.js";

export enum COLORS {
    DEBUG = '#F00',
    BG = '#000',
    BG_MILD = '#222',
    FG = '#FFF',
    FIRE = '#F8A',
    GRASS = '#BFC',
    WATER = '#9CF',
}

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

    strokerect(center: Pos, w: number, h: number, color?:string): void;

    fillrect(center: Pos, w: number, h: number, color?:string): void;

    text(p: Pos, s: string, opts?: {
        color?: string,
        size?: number,
        font?: string,
    }): void;
}