import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BackgroundColorSelectorComponent } from './background-color-selector/background-color-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    BackgroundColorSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
