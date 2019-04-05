import { Coordinate } from './coordinate';

export class GridSquare {
    public isHighlighted: boolean;

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

}
