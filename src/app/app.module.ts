import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BackgroundColorSelectorComponent } from './background-color-selector/background-color-selector.component';
import { LayerSelectorComponent } from './layer-selector/layer-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundColorSelectorComponent,
    LayerSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
