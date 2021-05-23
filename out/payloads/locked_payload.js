export class LockedPayload {
    constructor(isLocked, 
    // Something that was static won't become nonstatic on unlock.
    wasStatic = false) {
        this.isLocked = isLocked;
        this.wasStatic = wasStatic;
    }
}
