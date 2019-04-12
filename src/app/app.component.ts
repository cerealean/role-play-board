import { Component, OnInit } from '@angular/core';
import { GridSquare } from './models/grid-square';
import { Coordinate } from './models/coordinate';
import { CanvasBoard } from './models/canvas-board';
import { CanvasLayers } from './enums/canvas-layers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private step = 50;
  private canvasBoard: CanvasBoard;
  private gridLineThicknessInPx = 3;
  private halfGridLineThicknessInPx = this.gridLineThicknessInPx / 2;
  private squares: GridSquare[] = [];

  ngOnInit() {
    this.canvasBoard = new CanvasBoard();
    const canvasContainer = document.getElementById('canvas-container');
    for (const layer of Object.values(CanvasLayers)) {
      const element = this.createCanvasElement(layer);
      this.canvasBoard.addCanvas(layer, element);
      this.setZIndex(element, layer);
      canvasContainer.append(element);
    }
    const interactionLayer = this.canvasBoard
      .getCanvas(CanvasLayers.Interaction);
    interactionLayer.onclick = (event) => {
      this.gridClick(event);
    };
    interactionLayer.ondragover = (event) => {
      this.onDragOverAllowDrop(event);
    };
    interactionLayer.ondrop = (event) => {
      this.onDrop(event);
    };
  }

  private createCanvasElement(identifier: string): HTMLCanvasElement {
    const element = document.createElement('canvas');
    element.id = identifier;
    element.classList.add('canvas');

    return element;
  }

  public generate(width: number, height: number) {
    const gridCanvas = this.canvasBoard.getCanvas(CanvasLayers.Grid);
    const widthInPx = width * this.step;
    const heightInPx = height * this.step;
    const widthPxRemoveRemainder = widthInPx - (widthInPx % this.step);
    const heightPxRemoveRemainder = heightInPx - (heightInPx % this.step);
    this.canvasBoard.setDiminsions(widthPxRemoveRemainder, heightPxRemoveRemainder);
    this.generateGridSquares(Number(width), Number(height));
    this.drawGrid(gridCanvas.width, gridCanvas.height, this.step, gridCanvas.getContext('2d'));
  }

  public gridClick(event: MouseEvent) {
    const canvas = this.canvasBoard.getCanvas(CanvasLayers.Grid);
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

  private onDragOverAllowDrop(event: DragEvent) {
    event.preventDefault();
  }

  public onDrag(event: DragEvent) {
    event.dataTransfer.setData('text', (event.target as HTMLElement).id);
  }

  private onDrop(event: DragEvent) {
    const data = event.dataTransfer.getData('text');
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
