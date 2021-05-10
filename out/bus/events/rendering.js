export class SetRendering {
    constructor(entityId, 
    // renderingData unset means "clear rendering data"
    renderingData) {
        this.entityId = entityId;
        this.renderingData = renderingData;
        this.type = 'SET_RENDERING';
    }
}
