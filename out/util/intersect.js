export function rectContains(rectCenter, rectW, rectH, test) {
    const T = rectCenter.y - rectH / 2;
    const R = rectCenter.x + rectW / 2;
    const B = rectCenter.y + rectH / 2;
    const L = rectCenter.x - rectW / 2;
    return L <= test.x && test.x <= R &&
        T <= test.y && test.y <= B;
}
