import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiagramNode, DiagramNodeShape } from '../../models/node.model';
import { first } from 'rxjs/operators';
import { DiagramEditorStore } from '../../store/diagram-editor.store';

@Component({
  selector: 'app-node-edit',
  templateUrl: './node-edit.component.html',
})
export class NodeEditComponent implements OnInit {
  node: DiagramNode | null;

  form = new FormGroup({
    text: new FormControl(''),
    shape: new FormControl<DiagramNodeShape>(DiagramNodeShape.RoundEdges, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private readonly store: DiagramEditorStore) {}

  ngOnInit(): void {
    this.store.selectedNode$.pipe(first()).subscribe((node) => {
      this.node = node;
      if (node) {
        this.form.patchValue(node);
      }
    });
  }

  saveNode() {
    if (!this.node || !this.form.valid) {
      return;
    }

    const { text, shape } = this.form.value;

    const node: DiagramNode = {
      ...this.node,
      text: text || undefined,
      shape: shape,
    };

    this.store.updateNode(node);
  }
}
