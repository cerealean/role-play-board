import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CanvasLayers } from '../enums/canvas-layers';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss']
})
export class LayerSelectorComponent implements OnInit {
  public CanvasLayers = CanvasLayers;
  public editableLayers = [CanvasLayers.Monsters, CanvasLayers.Characters];

  @Output() selectedLayer = new EventEmitter<CanvasLayers>();

  constructor() { }

  ngOnInit() {
    this.selectedLayer.emit(this.editableLayers[0]);
  }

  onLayerChange(event: Event) {
    this.selectedLayer.emit(Number((event.target as HTMLSelectElement).value) as CanvasLayers);
  }

}
