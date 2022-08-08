import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DiagramEditorModule } from './diagram-editor/diagram-editor.module';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, DiagramEditorModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
