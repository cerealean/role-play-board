import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'background-color-selector',
  templateUrl: './background-color-selector.component.html',
  styleUrls: ['./background-color-selector.component.scss']
})
export class BackgroundColorSelectorComponent implements OnInit, OnChanges {
  public red = 0;
  public green = 0;
  public blue = 0;
  public alpha = 1;

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
    this.previewElement.style.backgroundColor = `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
  }

}
