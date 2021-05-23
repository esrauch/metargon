// 'Lock' pauses any animations and makes an entity static for some number of seconds.
export class Lock {
    constructor(entityId, seconds = 3) {
        this.entityId = entityId;
        this.seconds = seconds;
        this.type = 'LOCK';
    }
}
export class Unlock {
    constructor(entityId) {
        this.entityId = entityId;
        this.type = 'UNLOCK';
    }
}
