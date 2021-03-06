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
  private selectedLayer: CanvasLayers;
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
    interactionLayer.oncontextmenu = (event) => {
      this.boardRightClick(event);
    };
    interactionLayer.ondragover = (event) => {
      this.onDragOverAllowDrop(event);
    };
    interactionLayer.ondrop = (event) => {
      this.onDrop(event);
    };

    (window as any).sunshine = () => {
      console.log(this.canvasBoard);
    };
    this.generate(10, 10);
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

  public changeSelectedLayer(layer: CanvasLayers) {
    this.selectedLayer = layer;
    console.log('Selected layer is now', layer);
  }

  private gridClick(event: MouseEvent) {
    const squareClicked = this.getSquareFromEventCoordinates(event);
    if (squareClicked) {
      const canvas = this.canvasBoard.getCanvas(CanvasLayers.Highlight);
      this.toggleSquare(squareClicked, canvas.getContext('2d'));
      squareClicked.isHighlighted = !squareClicked.isHighlighted;
    }
  }

  private boardRightClick(event: MouseEvent) {
    event.preventDefault();
    const squareClicked = this.getSquareFromEventCoordinates(event);
    if (squareClicked) {
      const canvasToModify = this.canvasBoard.getCanvas(this.selectedLayer);
      const context = canvasToModify.getContext('2d');
      context.clearRect(squareClicked.topLeft.x, squareClicked.topLeft.y, squareClicked.getXLength(), squareClicked.getYLength());
    }
  }

  private getSquareFromEventCoordinates(event: MouseEvent) {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickCoordinate = new Coordinate(x, y);
    return this.squares.find(s => s.isCoordinateWithinSquare(clickCoordinate));
  }

  private onDragOverAllowDrop(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  public onDrag(event: DragEvent) {
    const dragData = (event.target as HTMLElement).id;
    event.dataTransfer.setData('text/plain', dragData);
    event.dataTransfer.dropEffect = 'copy';
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    const squareClicked = this.getSquareFromEventCoordinates(event);
    const data = event.dataTransfer.getData('text/plain');
    const image = new Image(this.step, this.step);
    image.src = (document.getElementById(data) as HTMLImageElement).src;
    const selectedContext = this.canvasBoard.getCanvas(this.selectedLayer).getContext('2d');
    selectedContext.drawImage(image, squareClicked.topLeft.x, squareClicked.topLeft.y);
  }

  public setBackgroundColor(color: string) {
    this.canvasBoard.canvasSettings.backgroundColor = color;
    this.canvasBoard.getCanvas(CanvasLayers.Background).fillWithColor(color);
  }

  private createCanvasElement(identifier: string): HTMLCanvasElement {
    const element = document.createElement('canvas');
    element.id = identifier;
    element.classList.add('canvas');

    return element;
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
