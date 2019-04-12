import { Component, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'background-color-selector',
  templateUrl: './background-color-selector.component.html',
  styleUrls: ['./background-color-selector.component.scss']
})
export class BackgroundColorSelectorComponent implements OnInit, OnChanges {
  public red = 250;
  public green = 249;
  public blue = 249;
  public alpha = 1;

  @Output() rgbaColorOutput = new EventEmitter<string>();

  private previewElement: HTMLElement;

  constructor() { }

  ngOnInit() {
    this.previewElement = document.getElementById('background-color-preview');
    this.setPreviewColor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.red || changes.green || changes.blue || changes.alpha) {
      console.log('changing');
      this.setPreviewColor();
    }
  }

  public setPreviewColor() {
    const rgbaColorString = `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
    this.previewElement.style.backgroundColor = rgbaColorString;
    this.rgbaColorOutput.emit(rgbaColorString);
  }

}
