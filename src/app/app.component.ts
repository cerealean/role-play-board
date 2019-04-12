import { Component, OnInit } from '@angular/core';
import { GridSquare } from './models/grid-square';
import { Coordinate } from './models/coordinate';
import { CanvasBoard } from './models/canvas-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private canvasBoard: CanvasBoard;
  private step: number;
  private gridLineThicknessInPx = 3;
  private halfGridLineThicknessInPx = this.gridLineThicknessInPx / 2;
  private squares: GridSquare[] = [];

  ngOnInit() {
    this.canvasBoard = new CanvasBoard();
    const gridLayer = this.createCanvasElement('role-play-grid');
    const backgroundLayer = this.createCanvasElement('background');
    const charLayer = this.createCanvasElement('characters');
    const clickLayer = this.createCanvasElement('click');
    this.setZIndex(gridLayer, 1);
    this.setZIndex(backgroundLayer, 2);
    this.setZIndex(charLayer, 3);
    this.setZIndex(clickLayer, 4);
    this.canvasBoard.grid = gridLayer;
    this.canvasBoard.characters = charLayer;
    this.canvasBoard.background = backgroundLayer;
    this.canvasBoard.clickLayer = clickLayer;
    clickLayer.onclick = (event) => {
      this.gridClick(event);
    };
    document.getElementById('canvas-container').append(this.canvasBoard.grid);
    document.getElementById('canvas-container').append(this.canvasBoard.background);
    document.getElementById('canvas-container').append(this.canvasBoard.characters);
    document.getElementById('canvas-container').append(this.canvasBoard.clickLayer);
  }

  private createCanvasElement(identifier: string): HTMLCanvasElement {
    const element = document.createElement('canvas');
    element.id = identifier;
    element.classList.add('canvas');

    return element;
  }

  public generate(width: number, height: number, squareSize: number) {
    const gridCanvas = this.canvasBoard.grid;
    this.step = Number(squareSize);
    const widthInPx = width * this.step;
    const heightInPx = height * this.step;
    const widthPxRemoveRemainder = widthInPx - (widthInPx % this.step);
    const heightPxRemoveRemainder = heightInPx - (heightInPx % this.step);
    this.canvasBoard.setDiminsions(widthPxRemoveRemainder, heightPxRemoveRemainder);
    this.generateGridSquares(Number(width), Number(height));
    this.drawGrid(gridCanvas.width, gridCanvas.height, this.step, gridCanvas.getContext('2d'));
  }

  public gridClick(event: MouseEvent) {
    console.log(this, event);
    const canvas = this.canvasBoard.grid;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickCoordinate = new Coordinate(x, y);
    const squareClicked = this.squares.find(s => s.isCoordinateWithinSquare(clickCoordinate));
    if (squareClicked) {
      this.toggleSquare(squareClicked, canvas.getContext('2d'));
      squareClicked.isHighlighted = !squareClicked.isHighlighted;
      console.log('Square clicked was', squareClicked, 'at coordinate', clickCoordinate);
    }
  }

  private generateGridSquares(widthSquares: number, heightSquares: number) {
    console.log(widthSquares, heightSquares);
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

  private setZIndex(canvas: HTMLCanvasElement, index: number) {
    canvas.style.zIndex = index.toString();
  }

  private toggleSquare(square: GridSquare, canvasContext: CanvasRenderingContext2D) {
    if (square.isHighlighted) {
      this.clearSquare(square, canvasContext);
    } else {
      this.paintSquare(square, canvasContext);
    }
  }

  private paintSquare(square: GridSquare, canvasContext: CanvasRenderingContext2D) {
    canvasContext.beginPath();
    canvasContext.fillStyle = 'rgba(42,82,190,1)';
    canvasContext.rect(
      square.topLeft.x + this.halfGridLineThicknessInPx,
      square.topLeft.y + this.halfGridLineThicknessInPx,
      square.getXLength() - this.gridLineThicknessInPx,
      square.getYLength() - this.gridLineThicknessInPx - this.halfGridLineThicknessInPx
    );
    canvasContext.fill();
  }

  private clearSquare(square: GridSquare, canvasContext: CanvasRenderingContext2D) {
    canvasContext.clearRect(
      square.topLeft.x + this.halfGridLineThicknessInPx,
      square.topLeft.y + this.halfGridLineThicknessInPx,
      square.getXLength() - this.gridLineThicknessInPx,
      square.getYLength() - this.gridLineThicknessInPx - this.halfGridLineThicknessInPx
    );
  }

  private drawGrid(width: number, height: number, step: number, canvasContext: CanvasRenderingContext2D) {
    canvasContext.beginPath();
    for (let index = 0; index <= width; index += step) {
      canvasContext.moveTo(index, 0);
      canvasContext.lineTo(index, height);
    }
    canvasContext.strokeStyle = 'black';
    canvasContext.lineWidth = 1;
    canvasContext.stroke();

    canvasContext.beginPath();
    for (let secondIndex = 0; secondIndex <= height; secondIndex += step) {
      canvasContext.moveTo(0, secondIndex);
      canvasContext.lineTo(width, secondIndex);
    }
    canvasContext.strokeStyle = 'black';
    canvasContext.lineWidth = 1;
    canvasContext.stroke();
  }

}
