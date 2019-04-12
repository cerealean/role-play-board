import { Component, OnInit } from '@angular/core';
import { GridSquare } from './models/grid-square';
import { Coordinate } from './models/coordinate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private step = 50;
  private gridLineThicknessInPx = 3;
  private halfGridLineThicknessInPx = this.gridLineThicknessInPx / 2;
  private squares: GridSquare[] = [];

  ngOnInit() {
    this.canvas = document.getElementById('role-play-grid') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
  }

  public generate(width: number, height: number) {
    const widthInPx = width * this.step;
    const heightInPx = height * this.step;
    this.canvas.width = widthInPx - (widthInPx % this.step);
    this.canvas.height = heightInPx - (heightInPx % this.step);
    this.generateGridSquares(Number(width), Number(height));
    this.drawGrid(this.canvas.width, this.canvas.height, this.step);
  }

  public gridClick(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickCoordinate = new Coordinate(x, y);
    const squareClicked = this.squares.find(s => s.isCoordinateWithinSquare(clickCoordinate));
    if (squareClicked) {
      this.toggleSquare(squareClicked);
      squareClicked.isHighlighted = !squareClicked.isHighlighted;
      console.log('Square clicked was', squareClicked, 'at coordinate', clickCoordinate);
    }
  }

  private generateGridSquares(widthSquares: number, heightSquares: number) {
    this.squares = [];
    for (let windex = 0; windex < widthSquares; windex++) {
      for (let yindex = 0; yindex < heightSquares; yindex++) {
        const topLeft = new Coordinate(
          this.step * windex + this.halfGridLineThicknessInPx,
          this.step * yindex + this.halfGridLineThicknessInPx
        );
        this.squares.push(
          new GridSquare(
            topLeft,
            new Coordinate(topLeft.x + this.step - this.gridLineThicknessInPx, topLeft.y - this.halfGridLineThicknessInPx),
            new Coordinate(topLeft.x, topLeft.y + this.step - this.halfGridLineThicknessInPx),
            new Coordinate(topLeft.x + this.step - this.gridLineThicknessInPx, topLeft.y + this.step + this.halfGridLineThicknessInPx)
          )
        );
      }
    }
  }

  private toggleSquare(square: GridSquare) {
    if (square.isHighlighted) {
      this.clearSquare(square);
    } else {
      this.paintSquare(square);
    }
  }

  private paintSquare(square: GridSquare) {
    this.context.beginPath();
    this.context.fillStyle = 'rgba(42,82,190,1)';
    this.context.rect(
      square.topLeft.x + this.halfGridLineThicknessInPx,
      square.topLeft.y + this.halfGridLineThicknessInPx,
      square.getXLength() - this.gridLineThicknessInPx,
      square.getYLength() - this.gridLineThicknessInPx - this.halfGridLineThicknessInPx
    );
    this.context.fill();
  }

  private clearSquare(square: GridSquare) {
    this.context.clearRect(
      square.topLeft.x + this.halfGridLineThicknessInPx,
      square.topLeft.y + this.halfGridLineThicknessInPx,
      square.getXLength() - this.gridLineThicknessInPx,
      square.getYLength() - this.gridLineThicknessInPx - this.halfGridLineThicknessInPx
    );
  }

  private drawGrid(width: number, height: number, step: number) {
    this.context.beginPath();
    for (let index = 0; index <= width; index += step) {
      this.context.moveTo(index, 0);
      this.context.lineTo(index, height);
    }
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 1;
    this.context.stroke();

    this.context.beginPath();
    for (let secondIndex = 0; secondIndex <= height; secondIndex += step) {
      this.context.moveTo(0, secondIndex);
      this.context.lineTo(width, secondIndex);
    }
    this.context.strokeStyle = 'black';
    this.context.lineWidth = 1;
    this.context.stroke();
  }

}
