import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundColorSelectorComponent } from './background-color-selector.component';

describe('BackgroundColorSelectorComponent', () => {
  let component: BackgroundColorSelectorComponent;
  let fixture: ComponentFixture<BackgroundColorSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundColorSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundColorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
