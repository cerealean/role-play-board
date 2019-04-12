import { Coordinate } from './coordinate';
import { CanvasLayers } from '../enums/canvas-layers';

export class GridSquare {
    public isHighlighted: boolean;

    private layerItems = new Map<CanvasLayers, any>();

    constructor(
        public topLeft: Coordinate,
        public topRight: Coordinate,
        public bottomLeft: Coordinate,
        public bottomRight: Coordinate
    ) { }

    public isCoordinateWithinSquare(coordinate: Coordinate) {
        return coordinate.x > this.topLeft.x && coordinate.x < this.topRight.x
            && coordinate.y < this.bottomLeft.y && coordinate.y > this.topLeft.y;
    }

    public getXLength() {
        return Math.abs(this.topLeft.x - this.topRight.x);
    }

    public getYLength() {
        return Math.abs(this.topLeft.y - this.bottomLeft.y);
    }

    public addLayerImage(layer: CanvasLayers, image: HTMLImageElement) {
        this.layerItems.set(layer, image);
    }

    public getLayerImage(layer: CanvasLayers): HTMLImageElement {
        return this.layerItems.get(layer);
    }

}
