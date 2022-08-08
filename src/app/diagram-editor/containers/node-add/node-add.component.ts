import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiagramNode, DiagramNodeLink, DiagramNodeShape } from '../../models/node.model';
import { first } from 'rxjs/operators';
import { DiagramEditorStore } from '../../store/diagram-editor.store';

enum DiagramNodePosition {
  Top = 'TOP',
  Bottom = 'BOTTOM',
  Child = 'CHILD',
}

@Component({
  selector: 'app-node-add',
  templateUrl: './node-add.component.html',
})
export class NodeAddComponent implements OnInit {
  private readonly defaultPosition = DiagramNodePosition.Child;
  private parentNode: DiagramNode | null;

  form = new FormGroup({
    position: new FormControl<DiagramNodePosition>(this.defaultPosition, {
      nonNullable: true,
    }),
    text: new FormControl('', { nonNullable: true }),
    shape: new FormControl<DiagramNodeShape>(DiagramNodeShape.RoundEdges, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private readonly store: DiagramEditorStore) {}

  ngOnInit() {
    this.store.selectedNode$.pipe(first()).subscribe((node) => (this.parentNode = node));
  }

  saveNode() {
    if (!this.parentNode || !this.form.valid) {
      return;
    }

    const { position, text, shape } = this.form.value;
    const node = {
      text,
      shape,
    };

    this.store.addNode({
      node,
      parentNodeId: this.parentNode.id,
      position: position ?? this.defaultPosition,
    });
  }
}
