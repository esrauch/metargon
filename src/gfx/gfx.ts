import { Pos, Vec, Positions } from "../coords/coords.js";
import { Icon } from "../payloads/rendering_payload.js";

export enum Color {
    DEBUG = '#F00',
    BG = '#000',
    BG_MILD = '#444',
    FG = '#FFF',
    FIRE = '#F8A',
    GRASS = '#AFB',
    WATER = '#9CF',
}

export const LINE_WIDTH = 10;

export type FlexiblePositions = Positions | Array<{x:number, y:number}>;

export interface Gfx {
    onViewportSizeChange(): void;

    clearAndSetTransform(): void;

    setGlobalOpacity(opacity: number): void;

    forceForegroundColor(color?: Color): void;

    line(from: Pos, to: Pos, color?: string): void;

    vector(from: Pos, vec: Vec, color?: string): void;

    circle(center: Pos, radius: number, color?: string): void;

    strokecircle(center: Pos, radius: number, color?: string): void;

    linestrip(c: Positions, color?: string): void;

    lineloop(c: Positions, color?: string): void;

    filledpoly(c: FlexiblePositions, color?: string): void;

    strokerect(center: Pos, w: number, h: number, color?: string): void;

    fillrect(center: Pos, w: number, h: number, color?: string): void;

    text(p: Pos, s: string, opts?: {
        color?: string,
        size?: number,
        font?: string,
    }): void;

    icon(icon: Icon, pos: Pos, w: number, color?: string): void;
}