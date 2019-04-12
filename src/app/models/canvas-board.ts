import { CanvasLayers } from '../enums/canvas-layers';

export class CanvasBoard {
    public background: HTMLCanvasElement;
    public grid: HTMLCanvasElement;
    public characters: HTMLCanvasElement;
    public clickLayer: HTMLCanvasElement;

    private canvasElements = new Map<CanvasLayers, HTMLCanvasElement>();

    public addCanvas(key: CanvasLayers, canvas: HTMLCanvasElement) {
        this.canvasElements.set(key, canvas);
    }

    public deleteCanvas(key: CanvasLayers) {
        this.getCanvas(key).remove();
        this.canvasElements.delete(key);
    }

    public getCanvas(key: CanvasLayers): HTMLCanvasElement {
        return this.canvasElements.has(key) ? this.canvasElements.get(key) : null;
    }

    public setDiminsions(width: number, height: number) {
        if (this.background) {
            this.background.width = width;
            this.background.height = height;
        }
        if (this.grid) {
            this.grid.width = width;
            this.grid.height = height;
        }
        if (this.characters) {
            this.characters.width = width;
            this.characters.height = height;
        }
        if (this.clickLayer) {
            this.clickLayer.width = width;
            this.clickLayer.height = height;
        }

        this.canvasElements.forEach(canvas => {
            canvas.width = width;
            canvas.height = height;
        });
    }
}
