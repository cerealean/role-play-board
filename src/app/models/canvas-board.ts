import { CanvasLayers } from '../enums/canvas-layers';
import { CanvasSettings } from './canvas-settings';

export class CanvasBoard {
    public canvasSettings = new CanvasSettings();

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
        this.canvasElements.forEach(canvas => {
            canvas.width = width;
            canvas.height = height;
        });
    }
}
