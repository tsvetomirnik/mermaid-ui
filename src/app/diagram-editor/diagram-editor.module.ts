import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { SharedModule } from '../shared/shared.module';
import { DiagramComponent } from './components/diagram/diagram.component';
import { NodeComponent } from './components/node/node.component';
import { NodeSelectComponent } from './components/node-select/node-select.component';
import { NodeEditComponent } from './containers/node-edit/node-edit.component';
import { NodeAddComponent } from './containers/node-add/node-add.component';
import { MenuContainerComponent } from './components/menu-container/menu-container.component';
import { NodeOptionsBarComponent } from './components/node-options-bar/node-options-bar.component';
import { NodeLinksManageComponent } from './containers/node-links-manage/node-links-manage.component';
import { DiagramEditorComponent } from './containers/diagram-editor/diagram-editor.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, A11yModule, SharedModule],
  declarations: [
    DiagramEditorComponent,
    DiagramComponent,
    NodeComponent,
    MenuContainerComponent,
    NodeSelectComponent,
    NodeAddComponent,
    NodeEditComponent,
    NodeOptionsBarComponent,
    NodeLinksManageComponent,
  ],
  exports: [DiagramEditorComponent],
})
export class DiagramEditorModule {}
