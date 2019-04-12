export class CanvasBoard {
    public background: HTMLCanvasElement;
    public grid: HTMLCanvasElement;
    public characters: HTMLCanvasElement;
    public clickLayer: HTMLCanvasElement;

    private canvasElements = new Map<string, HTMLCanvasElement>();

    public addCanvas(key: string, canvas: HTMLCanvasElement) {
        this.canvasElements.set(key, canvas);
    }

    public deleteCanvas(key: string) {
        this.getCanvas(key).remove();
        this.canvasElements.delete(key);
    }

    public getCanvas(key: string): HTMLCanvasElement {
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
